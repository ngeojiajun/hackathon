# Hackathon
Source code for the hackathon

## Setup
With `docker` and `docker-compose` installed run this command to bring the app up
```
# Bring up the stuffs with pgadmin along
docker-compose --profile db_debug up -d
# Bring up the normal stack
docker-compose up -d
# Run NPM install
docker-compose --profile setup up backend-init -d
```

## Initializing the database
Run the following files in order:
- `srps/init_database.sql`
- `srps/mock.sql`