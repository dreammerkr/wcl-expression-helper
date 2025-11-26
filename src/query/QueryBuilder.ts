import { GraphQLQuery, ReportQuery, CharacterQuery, GuildQuery } from '../types';

export class QueryBuilder {
  /**
   * Build a custom GraphQL query
   */
  static custom(query: string, variables?: Record<string, any>): GraphQLQuery {
    return {
      query,
      variables,
    };
  }

  /**
   * Get report data by code
   */
  static getReport(params: ReportQuery): GraphQLQuery {
    const { code, startTime, endTime, fightIDs } = params;

    let fightsFilter = '';
    if (startTime && endTime) {
      fightsFilter = `(startTime: ${startTime}, endTime: ${endTime})`;
    } else if (fightIDs && fightIDs.length > 0) {
      fightsFilter = `(fightIDs: [${fightIDs.join(', ')}])`;
    }

    const query = `
      query {
        reportData {
          report(code: "${code}") {
            code
            title
            startTime
            endTime
            owner {
              name
            }
            guild {
              name
              server {
                name
                region {
                  slug
                }
              }
            }
            fights${fightsFilter} {
              id
              name
              startTime
              endTime
              difficulty
              kill
              bossPercentage
            }
            masterData {
              actors(type: "Player") {
                id
                name
                type
                subType
                server
              }
            }
          }
        }
      }
    `;

    return { query };
  }

  /**
   * Get detailed fight data including damage, healing, and events
   */
  static getFightDetails(code: string, fightIDs: number[]): GraphQLQuery {
    const query = `
      query {
        reportData {
          report(code: "${code}") {
            code
            title
            fights(fightIDs: [${fightIDs.join(', ')}]) {
              id
              name
              startTime
              endTime
              difficulty
              kill
              bossPercentage
            }
            playerDetails(fightIDs: [${fightIDs.join(', ')}])
            table(fightIDs: [${fightIDs.join(', ')}], dataType: DamageDone)
          }
        }
      }
    `;

    return { query };
  }

  /**
   * Get character rankings and parses
   */
  static getCharacter(params: CharacterQuery): GraphQLQuery {
    const { name, serverSlug, serverRegion } = params;

    const query = `
      query {
        characterData {
          character(name: "${name}", serverSlug: "${serverSlug}", serverRegion: "${serverRegion}") {
            name
            server {
              name
              region {
                slug
              }
            }
            classID
            encounterRankings
          }
        }
      }
    `;

    return { query };
  }

  /**
   * Get guild progression and reports
   */
  static getGuild(params: GuildQuery): GraphQLQuery {
    const { name, serverSlug, serverRegion } = params;

    const query = `
      query {
        guildData {
          guild(name: "${name}", serverSlug: "${serverSlug}", serverRegion: "${serverRegion}") {
            name
            server {
              name
              region {
                slug
              }
            }
            attendance(zoneID: 0)
            members {
              name
              classID
            }
          }
        }
      }
    `;

    return { query };
  }

  /**
   * Get damage done events for a specific fight
   */
  static getDamageEvents(code: string, fightID: number, sourceID?: number): GraphQLQuery {
    let sourceFilter = sourceID ? `, sourceID: ${sourceID}` : '';

    const query = `
      query {
        reportData {
          report(code: "${code}") {
            events(
              fightIDs: [${fightID}]
              dataType: DamageDone
              ${sourceFilter}
            ) {
              data
              nextPageTimestamp
            }
          }
        }
      }
    `;

    return { query };
  }

  /**
   * Get healing done events for a specific fight
   */
  static getHealingEvents(code: string, fightID: number, sourceID?: number): GraphQLQuery {
    let sourceFilter = sourceID ? `, sourceID: ${sourceID}` : '';

    const query = `
      query {
        reportData {
          report(code: "${code}") {
            events(
              fightIDs: [${fightID}]
              dataType: Healing
              ${sourceFilter}
            ) {
              data
              nextPageTimestamp
            }
          }
        }
      }
    `;

    return { query };
  }

  /**
   * Get deaths in a fight
   */
  static getDeaths(code: string, fightID: number): GraphQLQuery {
    const query = `
      query {
        reportData {
          report(code: "${code}") {
            events(
              fightIDs: [${fightID}]
              dataType: Deaths
            ) {
              data
            }
          }
        }
      }
    `;

    return { query };
  }

  /**
   * Get table data (damage, healing, etc.) for a fight
   */
  static getTableData(
    code: string,
    fightIDs: number[],
    dataType: 'DamageDone' | 'DamageTaken' | 'Healing' | 'Casts' | 'Buffs' | 'Debuffs'
  ): GraphQLQuery {
    const query = `
      query {
        reportData {
          report(code: "${code}") {
            table(
              fightIDs: [${fightIDs.join(', ')}]
              dataType: ${dataType}
            )
          }
        }
      }
    `;

    return { query };
  }

  /**
   * Get skill timeline - returns timestamps when specific abilities were cast
   * @param code - Report code
   * @param fightID - Fight ID
   * @param abilityID - Ability/Skill ID (optional - if not provided, returns all casts)
   * @param sourceID - Source actor ID (optional - filters by specific player)
   */
  static getSkillTimeline(
    code: string,
    fightID: number,
    abilityID?: number,
    sourceID?: number
  ): GraphQLQuery {
    let abilityFilter = abilityID ? `, abilityID: ${abilityID}` : '';
    let sourceFilter = sourceID ? `, sourceID: ${sourceID}` : '';

    const query = `
      query {
        reportData {
          report(code: "${code}") {
            events(
              fightIDs: [${fightID}]
              dataType: Casts
              ${sourceFilter}
              ${abilityFilter}
            ) {
              data
              nextPageTimestamp
            }
          }
        }
      }
    `;

    return { query };
  }
}
