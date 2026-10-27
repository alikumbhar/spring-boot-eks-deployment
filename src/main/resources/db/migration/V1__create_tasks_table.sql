CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    description VARCHAR(2000),
    created_at TIMESTAMPTZ NOT NULL
);
