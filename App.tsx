
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ShiftCalendar } from './components/ShiftCalendar';
import { Header } from './components/Header';
import { FilterControls } from './components/FilterControls';
import { Legend } from './components/Legend';
import { AbsenceModal } from './components/AbsenceModal';
import { ReplacementModal } from './components/ReplacementModal';
import { useShiftData } from './hooks/useShiftData';
import type { ScheduledShift, Staff, Team } from './types';
import { ContractType, StaffRole } from './types';
import { LoginScreen } from './components/LoginScreen';
import { authenticateUser } from './services/authService';
import { ShiftPlanner } from './components/ShiftPlanner';
import { PersonnelPage } from './components/PersonnelPage';
import { StaffEditModal } from './components/StaffEditModal';

export type ActiveTab = 'nurses' | 'oss' | 'doctors';

const App: React.FC = () => {
    const { 
        isLoading: isDataLoading,
        staff,
        teams, 
        scheduledShifts, 
        shiftDefinitions,
        addAbsence, 
        findReplacements, 
        assignShift,
        getStaffById,
        getShiftDefinitionByCode,
        updateShift,
        overwriteSchedule,
        importSchedule,
        updateStaffMember,
        addShiftDefinition,
        deleteShiftDefinition,
        updateShiftDefinition,
        changePassword,
        addTeam,
        updateTeam,
        deleteTeam,
        getStaffAllowedLocations,
    } = useShiftData();

    const [currentUser, setCurrentUser] = useState<Staff | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
    const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState<ScheduledShift | null>(null);
    const [selectedStaffForDetail, setSelectedStaffForDetail] = useState<Staff | null>(null);
    const [view, setView] = useState<'calendar' | 'planner' | 'personnel'>('calendar');
    const [activeTab, setActiveTab] = useState<ActiveTab>('nurses');

    // Restore user session from localStorage on first mount
    useEffect(() => {
        if (!currentUser) {
            try {
                const stored = localStorage.getItem('currentUser');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed && parsed.id) {
                        setCurrentUser(parsed);
                    }
                }
            } catch {
                // ignore parse errors
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persist currentUser to localStorage (or clear on logout)
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    const handleLogin = useCallback(async (staffId: string, password: string) => {
        setIsAuthLoading(true);
        setLoginError(null);
        try {
            const user = await authenticateUser(staffId, password);
            setCurrentUser(user);
        } catch (error) {
            if (error instanceof Error) {
                setLoginError(error.message);
            } else {
                setLoginError("Si è verificato un errore inaspettato.");
            }
        } finally {
            setIsAuthLoading(false);
        }
    }, []);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        setView('calendar');
    }, []);

    const handleDateChange = useCallback((date: Date) => {
        setCurrentDate(date);
    }, []);

    const handleOpenAbsenceModal = useCallback(() => {
        setIsAbsenceModalOpen(true);
    }, []);

    const handleOpenReplacementModal = useCallback((shift: ScheduledShift) => {
        setSelectedShift(shift);
        setIsReplacementModalOpen(true);
    }, []);
    
    const handleOpenStaffDetail = useCallback((staff: Staff) => {
        setSelectedStaffForDetail(staff);
    }, []);

    const handleCloseModals = useCallback(() => {
        setIsAbsenceModalOpen(false);
        setIsReplacementModalOpen(false);
        setSelectedShift(null);
        setSelectedStaffForDetail(null);
    }, []);
    
    const handleAddAbsence = useCallback((staffId: string, reason: string, startDate: Date, endDate: Date) => {
        addAbsence(staffId, reason, startDate, endDate);
        handleCloseModals();
    }, [addAbsence, handleCloseModals]);

    const handleAssignShift = useCallback((shift: ScheduledShift, staffId: string) => {
        assignShift(shift.id, staffId);
        handleCloseModals();
    }, [assignShift, handleCloseModals]);
    
    const handleUpdateShift = useCallback((staffId: string, date: string, newShiftCode: string) => {
        updateShift(staffId, date, newShiftCode);
    }, [updateShift]);

    const handleUpdateStaff = useCallback((staffId: string, updates: Partial<Omit<Staff, 'id' | 'name'>>) => {
        updateStaffMember(staffId, updates);
    }, [updateStaffMember]);

    const handleScheduleOverwrite = useCallback((newShifts: ScheduledShift[], targetMonth: string, affectedStaffIds: string[]) => {
        overwriteSchedule(newShifts, targetMonth, affectedStaffIds);
        const newDate = new Date(`${targetMonth}-01T12:00:00Z`);
        handleDateChange(newDate);
        setView('calendar');
        alert("Calendario turni generato e aggiornato con successo!");
    }, [overwriteSchedule, handleDateChange]);

    const handleAddTeamAndMembers = useCallback(async (teamData: Omit<Team, 'id'>, memberIds: string[]) => {
        const newTeam: Team = {
            id: `team-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            ...teamData,
        };
        await addTeam(newTeam);

        for (const staffId of memberIds) {
            const staffMember = getStaffById(staffId);
            if (staffMember) {
                const updatedTeamIds = [...new Set([...(staffMember.teamIds || []), newTeam.id])];
                await updateStaffMember(staffId, { teamIds: updatedTeamIds });
            }
        }
    }, [addTeam, getStaffById, updateStaffMember]);

    const handleUpdateTeamAndMembers = useCallback(async (teamId: string, teamData: Partial<Omit<Team, 'id'>>, newMemberIds: string[]) => {
        await updateTeam(teamId, teamData);
        const newMemberIdsSet = new Set(newMemberIds);
        const originalMembers = staff.filter(s => s.teamIds?.includes(teamId));

        for(const member of originalMembers) {
            if (!newMemberIdsSet.has(member.id)) {
                const updatedTeamIds = member.teamIds.filter(id => id !== teamId);
                await updateStaffMember(member.id, { teamIds: updatedTeamIds });
            }
        }

        for(const staffId of newMemberIds) {
            const staffMember = getStaffById(staffId);
            if (staffMember && !staffMember.teamIds?.includes(teamId)) {
                const updatedTeamIds = [...(staffMember.teamIds || []), teamId];
                await updateStaffMember(staffId, { teamIds: updatedTeamIds });
            }
        }
    }, [updateTeam, staff, updateStaffMember, getStaffById]);

    const replacements = useMemo(() => {
        if (!selectedShift) return [];
        return findReplacements(selectedShift);
    }, [selectedShift, findReplacements]);

    const filteredStaff = useMemo(() => {
        const staffAndUnassigned = staff;
        switch (activeTab) {
            case 'nurses':
                return staffAndUnassigned.filter(s => s.role === StaffRole.Nurse || s.role === StaffRole.HeadNurse || s.id === 'unassigned');
            case 'oss':
                return staffAndUnassigned.filter(s => s.role === StaffRole.OSS || s.id === 'unassigned');
            case 'doctors':
                return staffAndUnassigned.filter(s => s.role === StaffRole.Doctor || s.id === 'unassigned');
            default:
                return staffAndUnassigned;
        }
    }, [staff, activeTab]);

    const plannerStaffList = useMemo(() => {
        switch (activeTab) {
            case 'nurses':
                return staff.filter(s => s.role === StaffRole.Nurse || s.role === StaffRole.HeadNurse);
            case 'oss':
                return staff.filter(s => s.role === StaffRole.OSS);
            case 'doctors':
                return staff.filter(s => s.role === StaffRole.Doctor);
            default:
                return [];
        }
    }, [staff, activeTab]);

    if (!currentUser) {
        return <LoginScreen staffList={staff} onLogin={handleLogin} error={loginError} isLoading={isAuthLoading} onChangePassword={changePassword} />;
    }

    if (isDataLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                     <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg text-gray-700 font-semibold">Caricamento dati in corso...</p>
                </div>
            </div>
        );
    }
    
    const TabButton: React.FC<{tabName: ActiveTab, label: string}> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg focus:outline-none transition-colors duration-200 ${
                activeTab === tabName
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
        >
            {label}
        </button>
    );

    const renderContent = () => {
        switch (view) {
            case 'calendar':
                return (
                    <>
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <FilterControls 
                                currentDate={currentDate} 
                                onDateChange={handleDateChange} 
                                onAddAbsenceClick={handleOpenAbsenceModal}
                                scheduledShifts={scheduledShifts}
                                staff={filteredStaff}
                                currentUser={currentUser}
                                onManagePersonnelClick={() => setView('personnel')}
                            />
                        </div>

                        <div className="mb-4 flex space-x-2 border-b-2 border-gray-200">
                           <TabButton tabName="nurses" label="Caposala e Infermieri" />
                           <TabButton tabName="oss" label="OSS" />
                           <TabButton tabName="doctors" label="Medici" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-3">
                                <ShiftCalendar 
                                    currentDate={currentDate}
                                    staffList={filteredStaff}
                                    scheduledShifts={scheduledShifts}
                                    shiftDefinitions={shiftDefinitions}
                                    teams={teams}
                                    onUncoveredShiftClick={handleOpenReplacementModal}
                                    currentUser={currentUser}
                                    onUpdateShift={handleUpdateShift}
                                    onOpenStaffDetail={handleOpenStaffDetail}
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <Legend activeTab={activeTab} shiftDefinitions={shiftDefinitions} />
                            </div>
                        </div>
                        {currentUser.role === StaffRole.HeadNurse && (
                            <div className="mt-8 flex justify-center">
                                 <button onClick={() => setView('planner')} className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 text-lg font-semibold">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Vai alla Pianificazione Automatica
                                </button>
                            </div>
                        )}
                    </>
                );
            case 'planner':
                return (
                    <ShiftPlanner 
                        staffList={plannerStaffList}
                        activeTab={activeTab}
                        onGenerateSchedule={handleScheduleOverwrite}
                        onImportSchedule={importSchedule}
                        getShiftDefinitionByCode={getShiftDefinitionByCode}
                        scheduledShifts={scheduledShifts}
                        shiftDefinitions={shiftDefinitions}
                        teams={teams}
                        onAddShift={addShiftDefinition}
                        deleteShiftDefinition={deleteShiftDefinition}
                        updateShiftDefinition={updateShiftDefinition}
                    />
                );
            case 'personnel':
                 return (
                    <PersonnelPage
                        staffList={staff}
                        onUpdateStaff={handleUpdateStaff}
                        shiftDefinitions={shiftDefinitions}
                        teams={teams}
                        onAddTeamAndMembers={handleAddTeamAndMembers}
                        onUpdateTeamAndMembers={handleUpdateTeamAndMembers}
                        onDeleteTeam={deleteTeam}
                    />
                );
            default:
                return null;
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Header currentUser={currentUser} onLogout={handleLogout} onNavigate={setView} currentView={view} />
            <main className="p-4 sm:p-6 lg:p-8 max-w-full mx-auto">
                {renderContent()}
            </main>

            {isAbsenceModalOpen && (
                <AbsenceModal 
                    staffList={staff}
                    onClose={handleCloseModals}
                    onAddAbsence={handleAddAbsence}
                    currentUser={currentUser}
                    shiftDefinitions={shiftDefinitions}
                />
            )}

            {isReplacementModalOpen && selectedShift && (
                <ReplacementModal 
                    shift={selectedShift}
                    replacements={replacements}
                    onClose={handleCloseModals}
                    onAssign={handleAssignShift}
                    getStaffById={getStaffById}
                    getShiftDefinitionByCode={getShiftDefinitionByCode}
                    currentUser={currentUser}
                />
            )}
            
            {selectedStaffForDetail && (
                <StaffEditModal
                    staff={selectedStaffForDetail}
                    onClose={handleCloseModals}
                    onSave={handleUpdateStaff}
                    shiftDefinitions={shiftDefinitions}
                    teams={teams}
                />
            )}
        </div>
    );
};

export default App;
