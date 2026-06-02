-- Esquema PostgreSQL inicial para Módulo 1: Gestión de usuarios
-- Base centralizada para reemplazar gradualmente SQLite local.

CREATE TABLE IF NOT EXISTS roles (
  id_rol SERIAL PRIMARY KEY,
  nombre_rol VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO roles (nombre_rol, descripcion)
VALUES
  ('usuario_app', 'Usuario final de la aplicación móvil'),
  ('administrador', 'Administrador del panel web')
ON CONFLICT (nombre_rol) DO NOTHING;

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario SERIAL PRIMARY KEY,
  id_rol INTEGER NOT NULL REFERENCES roles(id_rol),
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(180) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS perfiles (
  id_perfil SERIAL PRIMARY KEY,
  id_usuario INTEGER UNIQUE NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  edad INTEGER,
  peso NUMERIC(6,2),
  altura NUMERIC(4,2),
  genero VARCHAR(30),
  objetivo VARCHAR(80),
  nivel VARCHAR(40),
  dias_semana VARCHAR(40),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sesiones (
  id_sesion SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sesiones_usuario ON sesiones(id_usuario);
CREATE INDEX IF NOT EXISTS idx_sesiones_token_hash ON sesiones(token_hash);

CREATE TABLE IF NOT EXISTS codigos_verificacion (
  id_codigo SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  email_destino VARCHAR(180) NOT NULL,
  codigo VARCHAR(10) NOT NULL,
  tipo VARCHAR(40) NOT NULL CHECK (tipo IN ('registro', 'reset_password', 'cambio_email')),
  payload JSONB,
  usado BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expira_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_codigos_email_tipo ON codigos_verificacion(email_destino, tipo);
CREATE INDEX IF NOT EXISTS idx_codigos_usuario_tipo ON codigos_verificacion(id_usuario, tipo);
