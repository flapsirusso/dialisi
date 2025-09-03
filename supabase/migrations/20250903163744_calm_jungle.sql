/*
  # Create teams table

  1. New Tables
    - `teams`
      - `id` (text, primary key)
      - `name` (text, not null)
      - `locations` (text array, default empty array)
      - `allowedShiftCodes` (text array, default empty array)

  2. Security
    - Enable RLS on `teams` table
    - Add policy for authenticated users to read team data

  3. Initial Data
    - Seed with 6 teams including Team Sant'Eugenio, Team Santa Caterina, Team CTO, etc.
*/

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id text PRIMARY KEY,
  name text NOT NULL,
  locations text[] NOT NULL DEFAULT ARRAY[]::text[],
  "allowedShiftCodes" text[] NOT NULL DEFAULT ARRAY[]::text[]
);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read teams
CREATE POLICY "Authenticated users can read teams"
  ON teams
  FOR SELECT
  TO authenticated
  USING (true);

-- Seed teams data
INSERT INTO teams (id, name, locations, "allowedShiftCodes") VALUES
('team-se', 'Team Sant''Eugenio', ARRAY['Dialisi Sant''Eugenio','Urgenza Sant''Eugenio','Reparto Nefrologia Sant''Eugenio','Ambulatorio DH Sant''Eugenio','Stanza B','Piano 0','Piano 2'], ARRAY['Md','Ps','Mu','Pu','Mn','Pn','N','Mat','Mat/e','Me','Pe','Mb','Pb','M0','P0','MT','PT','G_doc','R_doc','A_doc','N_doc']),
('team-sc', 'Team Santa Caterina', ARRAY['Dialisi Santa Caterina'], ARRAY['Msc','Psc']),
('team-cto', 'Team CTO', ARRAY['Dialisi CTO','Dialisi Peritoneale CTO'], ARRAY['Mc','Pc','Mac','G_doc','R_doc']),
('team-co', 'Team Camera Operatoria', ARRAY['Sala Operatoria Sant''Eugenio'], ARRAY['Mco']),
('team-misto', 'Team Misto (Tutte le Sedi)', ARRAY['Dialisi Sant''Eugenio','Dialisi Santa Caterina','Dialisi CTO','Urgenza Sant''Eugenio','Sala Operatoria Sant''Eugenio','Dialisi Peritoneale CTO','Reparto Nefrologia Sant''Eugenio','Ambulatorio DH Sant''Eugenio','Ambulatorio Via Marotta','Esterno','Stanza B','Piano 0','Piano 2'], ARRAY['Md','Ps','Msc','Psc','Mc','Pc','Mu','Pu','Mco','Mac','Mn','Pn','N','Mat','Mat/e','Me','Pe','Mb','Pb']),
('team-management', 'Team Direzione', ARRAY['Direzione'], ARRAY['M','R_doc'])
ON CONFLICT (id) DO NOTHING;