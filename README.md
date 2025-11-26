# WCL Query Maker

A TypeScript service for building and executing GraphQL queries against the Warcraft Logs (WCL) API.

## Features

- OAuth 2.0 authentication with automatic token refresh
- GraphQL query builder for common WCL queries
- RESTful API wrapper for easy integration
- TypeScript support with full type definitions
- Comprehensive query methods for:
  - Reports and combat logs
  - Fight details and events
  - Damage, healing, and death events
  - Character rankings and parses
  - Guild data and progression

## Prerequisites

- Node.js 16+ and npm
- WCL API credentials (Client ID and Client Secret)

## Getting Started

### 1. Get WCL API Credentials

1. Visit [Warcraft Logs API Clients](https://www.warcraftlogs.com/api/clients/)
2. Create a new client to get your Client ID and Client Secret

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
WCL_CLIENT_ID=your_client_id_here
WCL_CLIENT_SECRET=your_client_secret_here
PORT=3000
NODE_ENV=development
```

### 4. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
```http
GET /api/health
```
Test the connection to WCL API.

### Custom GraphQL Query
```http
POST /api/custom
Content-Type: application/json

{
  "query": "query { ... }",
  "variables": {}
}
```

### Get Report
```http
GET /api/report/:code
GET /api/report/:code?fightIDs=1,2,3
GET /api/report/:code?startTime=0&endTime=1000
```

Examples:
- `GET /api/report/ABC123` - Get full report
- `GET /api/report/ABC123?fightIDs=1,2` - Get specific fights

### Get Fight Details
```http
GET /api/report/:code/fights/:fightIDs
```

Example:
- `GET /api/report/ABC123/fights/1,2,3` - Get detailed data for fights 1, 2, and 3

### Get Table Data
```http
GET /api/report/:code/table/:dataType?fightIDs=1,2
```

Data types: `DamageDone`, `DamageTaken`, `Healing`, `Casts`, `Buffs`, `Debuffs`

Examples:
- `GET /api/report/ABC123/table/DamageDone?fightIDs=1,2`
- `GET /api/report/ABC123/table/Healing?fightIDs=3`

### Get Events

Damage events:
```http
GET /api/report/:code/events/damage/:fightID
GET /api/report/:code/events/damage/:fightID?sourceID=5
```

Healing events:
```http
GET /api/report/:code/events/healing/:fightID
GET /api/report/:code/events/healing/:fightID?sourceID=5
```

Deaths:
```http
GET /api/report/:code/deaths/:fightID
```

### Get Skill Timeline
```http
GET /api/report/:code/skills/:fightID
GET /api/report/:code/skills/:fightID?abilityID=12345
GET /api/report/:code/skills/:fightID?abilityID=12345,67890,11111
GET /api/report/:code/skills/:fightID?abilityID=12345&sourceID=5
```

Returns a timeline of skill/ability casts with timestamps. The response includes:
- `fightID`: The fight ID queried
- `requestedAbilityIDs`: Array of ability IDs that were requested (null if all skills)
- `skillTimeline`: Object with skill IDs as keys and arrays of timestamps as values
- `rawEvents`: Complete event data from WCL

Query Parameters:
- `abilityID` (optional): Filter by specific ability/skill ID(s). Supports:
  - Single ID: `abilityID=12345`
  - Multiple IDs (comma-separated): `abilityID=12345,67890,11111`
- `sourceID` (optional): Filter by specific player/actor ID

Examples:
- `GET /api/report/ABC123/skills/1` - Get all skill casts in fight 1
- `GET /api/report/ABC123/skills/1?abilityID=12345` - Get casts of skill 12345 only
- `GET /api/report/ABC123/skills/1?abilityID=12345,67890` - Get casts of multiple skills
- `GET /api/report/ABC123/skills/1?sourceID=5` - Get all casts from player with ID 5
- `GET /api/report/ABC123/skills/1?abilityID=12345,67890&sourceID=5` - Get specific skills from specific player

### Get Character Data
```http
GET /api/character/:region/:server/:name
```

Example:
- `GET /api/character/us/area-52/playername`

### Get Guild Data
```http
GET /api/guild/:region/:server/:name
```

Example:
- `GET /api/guild/us/area-52/guildname`

## Programmatic Usage

You can also use the service programmatically:

```typescript
import { WCLClient } from './query/WCLClient';
import { QueryBuilder } from './query/QueryBuilder';

const client = new WCLClient({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret'
});

// Get report data
const reportQuery = QueryBuilder.getReport({ code: 'ABC123' });
const result = await client.query(reportQuery);

// Execute custom query
const customQuery = QueryBuilder.custom(`
  query {
    reportData {
      report(code: "ABC123") {
        title
      }
    }
  }
`);
const customResult = await client.query(customQuery);
```

## Query Builder Methods

The `QueryBuilder` class provides pre-built queries:

- `QueryBuilder.custom(query, variables)` - Execute custom GraphQL query
- `QueryBuilder.getReport(params)` - Get report by code
- `QueryBuilder.getFightDetails(code, fightIDs)` - Get detailed fight data
- `QueryBuilder.getDamageEvents(code, fightID, sourceID?)` - Get damage events
- `QueryBuilder.getHealingEvents(code, fightID, sourceID?)` - Get healing events
- `QueryBuilder.getDeaths(code, fightID)` - Get death events
- `QueryBuilder.getTableData(code, fightIDs, dataType)` - Get table data
- `QueryBuilder.getCharacter(params)` - Get character rankings
- `QueryBuilder.getGuild(params)` - Get guild data

## Example Requests

### Get a Combat Log Report

```bash
curl http://localhost:3000/api/report/ABC123
```

### Get Damage Done for Specific Fights

```bash
curl http://localhost:3000/api/report/ABC123/table/DamageDone?fightIDs=1,2,3
```

### Get Character Rankings

```bash
curl http://localhost:3000/api/character/us/area-52/playername
```

### Execute Custom GraphQL Query

```bash
curl -X POST http://localhost:3000/api/custom \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { reportData { report(code: \"ABC123\") { title } } }"
  }'
```

## Project Structure

```
src/
├── auth/
│   └── WCLAuthClient.ts      # OAuth 2.0 authentication
├── query/
│   ├── QueryBuilder.ts       # GraphQL query builder
│   └── WCLClient.ts          # WCL API client
├── routes/
│   └── query.routes.ts       # API route handlers
├── middleware/
│   └── errorHandler.ts       # Error handling middleware
├── types/
│   └── index.ts              # TypeScript type definitions
└── index.ts                  # Application entry point
```

## Development

Build the project:
```bash
npm run build
```

Run in development mode:
```bash
npm run dev
```

## Resources

- [WCL API Documentation](https://www.archon.gg/wow/articles/help/api-documentation)
- [WCL API Clients](https://www.warcraftlogs.com/api/clients/)
- [GraphQL Documentation](https://graphql.org/)

## License

ISC
