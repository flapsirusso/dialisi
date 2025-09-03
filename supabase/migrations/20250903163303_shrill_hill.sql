/*
  # Create and populate shift_definitions table

  1. New Tables
    - `shift_definitions`
      - `code` (text, primary key) - Unique shift code identifier
      - `description` (text) - Human readable shift description
      - `location` (text) - Where the shift takes place
      - `time` (text) - Time period (Mattina, Pomeriggio, Notte, etc.)
      - `color` (text) - Background color for UI display
      - `textColor` (text) - Text color for UI display
      - `roles` (text array) - Allowed roles for this shift

  2. Security
    - Enable RLS on `shift_definitions` table
    - Add policy for authenticated users to read shift definitions

  3. Data Population
    - Inserts all shift definitions used by the application
    - Includes proper Italian time periods and role mappings
*/

-- Create shift_definitions table
CREATE TABLE IF NOT EXISTS shift_definitions (
  code text PRIMARY KEY,
  description text NOT NULL,
  location text,
  time text NOT NULL,
  color text NOT NULL,
  "textColor" text NOT NULL,
  roles text[] DEFAULT ARRAY[]::text[]
);

-- Enable RLS
ALTER TABLE shift_definitions ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read shift definitions
CREATE POLICY "Authenticated users can read shift definitions"
  ON shift_definitions
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert shift definitions data
INSERT INTO shift_definitions (code, description, location, time, color, "textColor", roles)
VALUES
('M', 'Mattina Direzione', 'Direzione', 'Mattina', 'bg-slate-200', 'text-slate-800', '{Caposala}'),
('Md', 'Mattina Dialisi S.Eugenio', 'Dialisi Sant''Eugenio', 'Mattina', 'bg-blue-200', 'text-blue-800', '{Infermiere,Caposala}'),
('Ps', 'Pomeriggio+Sera Dialisi S.Eugenio', 'Dialisi Sant''Eugenio', 'Pomeriggio', 'bg-blue-300', 'text-blue-900', '{Infermiere,Caposala}'),
('Msc', 'Mattina Dialisi S.Caterina', 'Dialisi Santa Caterina', 'Mattina', 'bg-green-200', 'text-green-800', '{Infermiere,Caposala}'),
('Psc', 'Pomeriggio Dialisi S.Caterina', 'Dialisi Santa Caterina', 'Pomeriggio', 'bg-green-200', 'text-green-800', '{Infermiere,Caposala}'),
('Mc', 'Mattina Dialisi CTO', 'Dialisi CTO', 'Mattina', 'bg-indigo-200', 'text-indigo-800', '{Infermiere,Caposala}'),
('Pc', 'Pomeriggio Dialisi CTO', 'Dialisi CTO', 'Pomeriggio', 'bg-indigo-200', 'text-indigo-800', '{Infermiere,Caposala}'),
('Mu', 'Mattina Urgenza S.Eugenio', 'Urgenza Sant''Eugenio', 'Mattina', 'bg-red-200', 'text-red-800', '{Infermiere,Caposala}'),
('Pu', 'Pomeriggio Urgenza S.Eugenio', 'Urgenza Sant''Eugenio', 'Pomeriggio', 'bg-red-200', 'text-red-800', '{Infermiere,Caposala}'),
('Mco', 'Mattina Sala Operatoria S.Eugenio', 'Sala Operatoria Sant''Eugenio', 'Mattina', 'bg-purple-200', 'text-purple-800', '{Infermiere,Caposala}'),
('Mac', 'Mattina Dialisi Peritoneale CTO', 'Dialisi Peritoneale CTO', 'Mattina', 'bg-teal-200', 'text-teal-800', '{Infermiere,Caposala}'),
('Mn', 'Mattina Reparto Nefrologia', 'Reparto Nefrologia Sant''Eugenio', 'Mattina', 'bg-yellow-200', 'text-yellow-800', '{Infermiere,Caposala}'),
('Pn', 'Pomeriggio Reparto Nefrologia', 'Reparto Nefrologia Sant''Eugenio', 'Pomeriggio', 'bg-yellow-200', 'text-yellow-800', '{Infermiere,Caposala}'),
('N', 'Notte Reparto Nefrologia', 'Reparto Nefrologia Sant''Eugenio', 'Notte', 'bg-gray-800', 'text-white', '{Infermiere,Caposala}'),
('Mat', 'Mattina Ambulatorio', 'Ambulatorio DH Sant''Eugenio', 'Mattina', 'bg-pink-200', 'text-pink-800', '{Infermiere,Caposala}'),
('Mat/e', 'Mattina Ambulatorio/Esterno', 'Ambulatorio DH Sant''Eugenio', 'Mattina', 'bg-pink-300', 'text-pink-900', '{Infermiere,Caposala}'),
('Me', 'Mattina Esterno', 'Esterno', 'Mattina', 'bg-orange-200', 'text-orange-800', '{Infermiere,Caposala}'),
('Pe', 'Pomeriggio Esterno', 'Esterno', 'Pomeriggio', 'bg-orange-200', 'text-orange-800', '{Infermiere,Caposala}'),
('Mb', 'Mattina Stanza B', 'Stanza B', 'Mattina', 'bg-yellow-400', 'text-yellow-900', '{Infermiere,Caposala}'),
('Pb', 'Pomeriggio Stanza B', 'Stanza B', 'Pomeriggio', 'bg-yellow-400', 'text-yellow-900', '{Infermiere,Caposala}'),
('M0', 'Mattina Piano 0', 'Piano 0', 'Mattina', 'bg-cyan-200', 'text-cyan-800', '{OSS}'),
('P0', 'Pomeriggio Piano 0', 'Piano 0', 'Pomeriggio', 'bg-cyan-200', 'text-cyan-800', '{OSS}'),
('MT', 'Mattina Piano 2', 'Piano 2', 'Mattina', 'bg-lime-200', 'text-lime-800', '{OSS}'),
('PT', 'Pomeriggio Piano 2', 'Piano 2', 'Pomeriggio', 'bg-lime-200', 'text-lime-800', '{OSS}'),
('G_doc', 'Guardia', 'Urgenza Sant''Eugenio', 'Giornata', '#fecaca', '#991b1b', '{Medico}'),
('R_doc', 'Reperibilità', 'Direzione', 'Giornata', '#fed7aa', '#9a3412', '{Medico}'),
('A_doc', 'Ambulatorio', 'Ambulatorio DH Sant''Eugenio', 'Mattina', '#bfdbfe', '#1e40af', '{Medico}'),
('N_doc', 'Notte Medico', 'Reparto Nefrologia Sant''Eugenio', 'Notte', '#1f2937', '#f9fafb', '{Medico}'),
('S', 'Smonto Notte', 'Reparto Nefrologia Sant''Eugenio', 'Riposo', 'bg-gray-400', 'text-white', '{Caposala,Infermiere,OSS,Medico}'),
('RS', 'Riposo Settimanale', 'Direzione', 'Riposo', 'bg-gray-400', 'text-white', '{Caposala,Infermiere,OSS,Medico}'),
('R', 'Riposo', 'Direzione', 'Riposo', 'bg-gray-400', 'text-white', '{Caposala,Infermiere,OSS,Medico}'),
('HD', 'Permesso L.104', 'Direzione', 'Assenza', 'bg-red-500', 'text-white', '{Caposala,Infermiere,OSS,Medico}'),
('RF', 'Recupero Festivo', 'Direzione', 'Assenza', 'bg-purple-500', 'text-white', '{Caposala,Infermiere,OSS,Medico}'),
('A', 'Malattia', 'Direzione', 'Assenza', 'bg-red-500', 'text-white', '{Caposala,Infermiere,OSS,Medico}'),
('T1', 'Malattia Figlio', 'Direzione', 'Assenza', 'bg-red-500', 'text-white', '{Caposala,Infermiere,OSS,Medico}'),
('FE', 'Ferie', 'Direzione', 'Assenza', 'bg-green-500', 'text-white', '{Caposala,Infermiere,OSS,Medico}'),
('UNCOVERED', 'Turno Scoperto', 'Direzione', 'Fuori Turno', 'bg-red-600 animate-pulse', 'text-white', '{}')
ON CONFLICT (code) DO NOTHING;