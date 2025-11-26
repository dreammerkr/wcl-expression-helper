import { Router, Request, Response, NextFunction } from 'express';
import { WCLClient } from '../query/WCLClient';
import { QueryBuilder } from '../query/QueryBuilder';

export function createQueryRouter(wclClient: WCLClient): Router {
  const router = Router();

  // Health check / test connection
  router.get('/health', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isConnected = await wclClient.testConnection();
      res.json({
        success: true,
        data: {
          status: isConnected ? 'connected' : 'disconnected',
          apiUrl: 'https://www.warcraftlogs.com/api/v2/client',
        },
      });
    } catch (error) {
      next(error);
    }
  });

  // Execute custom GraphQL query
  router.post('/custom', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, variables } = req.body;

      if (!query) {
        res.status(400);
        throw new Error('Query is required');
      }

      const graphqlQuery = QueryBuilder.custom(query, variables);
      const result = await wclClient.query(graphqlQuery);

      res.json({
        success: true,
        data: result.data,
        errors: result.errors,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get report by code
  router.get('/report/:code', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;
      const { startTime, endTime, fightIDs } = req.query;

      const query = QueryBuilder.getReport({
        code,
        startTime: startTime ? Number(startTime) : undefined,
        endTime: endTime ? Number(endTime) : undefined,
        fightIDs: fightIDs
          ? (Array.isArray(fightIDs) ? fightIDs.map(Number) : [Number(fightIDs)])
          : undefined,
      });

      const result = await wclClient.query(query);

      res.json({
        success: true,
        data: result.data,
        errors: result.errors,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get fight details
  router.get('/report/:code/fights/:fightIDs', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, fightIDs } = req.params;
      const fightIDArray = fightIDs.split(',').map(Number);

      const query = QueryBuilder.getFightDetails(code, fightIDArray);
      const result = await wclClient.query(query);

      res.json({
        success: true,
        data: result.data,
        errors: result.errors,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get table data for fights
  router.get('/report/:code/table/:dataType', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, dataType } = req.params;
      const { fightIDs } = req.query;

      if (!fightIDs) {
        res.status(400);
        throw new Error('fightIDs query parameter is required');
      }

      const validDataTypes = ['DamageDone', 'DamageTaken', 'Healing', 'Casts', 'Buffs', 'Debuffs'];
      if (!validDataTypes.includes(dataType)) {
        res.status(400);
        throw new Error(`Invalid dataType. Must be one of: ${validDataTypes.join(', ')}`);
      }

      const fightIDArray = Array.isArray(fightIDs)
        ? fightIDs.map(Number)
        : [Number(fightIDs)];

      const query = QueryBuilder.getTableData(
        code,
        fightIDArray,
        dataType as any
      );

      const result = await wclClient.query(query);

      res.json({
        success: true,
        data: result.data,
        errors: result.errors,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get damage events
  router.get('/report/:code/events/damage/:fightID', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, fightID } = req.params;
      const { sourceID } = req.query;

      const query = QueryBuilder.getDamageEvents(
        code,
        Number(fightID),
        sourceID ? Number(sourceID) : undefined
      );

      const result = await wclClient.query(query);

      res.json({
        success: true,
        data: result.data,
        errors: result.errors,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get healing events
  router.get('/report/:code/events/healing/:fightID', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, fightID } = req.params;
      const { sourceID } = req.query;

      const query = QueryBuilder.getHealingEvents(
        code,
        Number(fightID),
        sourceID ? Number(sourceID) : undefined
      );

      const result = await wclClient.query(query);

      res.json({
        success: true,
        data: result.data,
        errors: result.errors,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get deaths
  router.get('/report/:code/deaths/:fightID', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, fightID } = req.params;

      const query = QueryBuilder.getDeaths(code, Number(fightID));
      const result = await wclClient.query(query);

      res.json({
        success: true,
        data: result.data,
        errors: result.errors,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get character data
  router.get('/character/:region/:server/:name', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { region, server, name } = req.params;

      const query = QueryBuilder.getCharacter({
        name,
        serverSlug: server,
        serverRegion: region,
      });

      const result = await wclClient.query(query);

      res.json({
        success: true,
        data: result.data,
        errors: result.errors,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get guild data
  router.get('/guild/:region/:server/:name', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { region, server, name } = req.params;

      const query = QueryBuilder.getGuild({
        name,
        serverSlug: server,
        serverRegion: region,
      });

      const result = await wclClient.query(query);

      res.json({
        success: true,
        data: result.data,
        errors: result.errors,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get skill timeline - returns timestamps when abilities/skills were cast
  router.get('/report/:code/skills/:fightID', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, fightID } = req.params;
      const { abilityID, sourceID } = req.query;

      // Parse ability IDs - can be single ID or comma-separated list
      let requestedAbilityIDs: Set<number> | null = null;
      if (abilityID) {
        const abilityIDStr = Array.isArray(abilityID) ? abilityID[0] : abilityID;
        const abilityIDArray = abilityIDStr.toString().split(',').map(id => Number(id.trim()));
        requestedAbilityIDs = new Set(abilityIDArray);
      }

      // Query without abilityID filter to get all casts, then filter client-side
      // This allows us to get multiple specific abilities in one query
      const query = QueryBuilder.getSkillTimeline(
        code,
        Number(fightID),
        undefined, // Don't filter by ability on server side
        sourceID ? Number(sourceID) : undefined
      );

      const result = await wclClient.query(query);

      // Process the events to create skill-time pairs
      if (result.data?.reportData?.report?.events?.data) {
        const events = result.data.reportData.report.events.data;
        const skillTimeline: { [skillId: string]: number[] } = {};

        // Group events by ability ID and collect timestamps
        events.forEach((event: any) => {
          if (event.type === 'cast' && event.abilityGameID) {
            const abilityGameID = event.abilityGameID;

            // If specific ability IDs were requested, filter by them
            if (requestedAbilityIDs && !requestedAbilityIDs.has(abilityGameID)) {
              return; // Skip this event
            }

            const skillId = abilityGameID.toString();
            const timestamp = event.timestamp;

            if (!skillTimeline[skillId]) {
              skillTimeline[skillId] = [];
            }
            skillTimeline[skillId].push(timestamp);
          }
        });

        res.json({
          success: true,
          data: {
            fightID: Number(fightID),
            requestedAbilityIDs: requestedAbilityIDs ? Array.from(requestedAbilityIDs) : null,
            skillTimeline,
            rawEvents: events,
          },
          errors: result.errors,
        });
      } else {
        res.json({
          success: true,
          data: result.data,
          errors: result.errors,
        });
      }
    } catch (error) {
      next(error);
    }
  });

  return router;
}
