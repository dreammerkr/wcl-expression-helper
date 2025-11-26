# WCL Expression Spell Sets - TWW Season 3

This document lists the spell IDs used in the expression helper presets.

## 🛡️ Raid Defensive Cooldowns

Abilities that reduce damage taken by the entire raid or provide raid-wide damage mitigation.

| Spell ID | Ability Name | Class | Spec | Description |
|----------|--------------|-------|------|-------------|
| 97462 | Rallying Cry | Warrior | All | Increases max health of all party/raid members by 10% for 10 sec |
| 196718 | Darkness | Demon Hunter | Vengeance | Creates area that grants 20% miss chance for 8 sec |
| 51052 | Anti-Magic Zone | Death Knight | All | Creates zone that absorbs magic damage for 10 sec |
| 98008 | Spirit Link Totem | Shaman | Restoration | Redistributes health among raid members within 40 yards |
| 62618 | Power Word: Barrier | Priest | Discipline | Reduces all damage taken by 25% for 10 sec |
| 31821 | Aura Mastery | Paladin | Holy | Empowers Aura to reduce magic damage by 20% for 8 sec |

## 💚 Healing Cooldowns

Major healing throughput abilities used to heal the raid during heavy damage.

| Spell ID | Ability Name | Class | Spec | Description |
|----------|--------------|-------|------|-------------|
| 740 | Tranquility | Druid | Restoration | Massive AoE heal over 8 seconds |
| 197721 | Flourish | Druid | Restoration | Extends HoT duration by 8 sec |
| 115310 | Revival | Monk | Mistweaver | Instant AoE heal that dispels harmful effects |
| 31821 | Aura Mastery | Paladin | Holy | Empowers aura effects for 8 sec |
| 62618 | Power Word: Barrier | Priest | Discipline | Reduces damage and increases healing in area |
| 64843 | Divine Hymn | Priest | Holy | Powerful channeled raid heal over 8 sec |
| 265202 | Holy Word: Salvation | Priest | Holy | Massive instant AoE heal |
| 114052 | Ascendance | Shaman | Restoration | Transform to heal all damaged raid members |
| 108280 | Healing Tide Totem | Shaman | Restoration | Summons totem that pulses raid healing |
| 98008 | Spirit Link Totem | Shaman | Restoration | Redistributes health and reduces damage |
| 363534 | Rewind | Evoker | Preservation | Resets cooldown of healing spells |
| 355936 | Dream Breath | Evoker | Preservation | Powerful cone healing ability |

## 🔰 External Defensives

Single-target abilities used to prevent damage on specific allies (tanks, vulnerable players).

| Spell ID | Ability Name | Class | Spec | Description |
|----------|--------------|-------|------|-------------|
| 102342 | Ironbark | Druid | Restoration | Reduces damage taken by 20% for 12 sec |
| 47788 | Guardian Spirit | Priest | Holy | Increases healing by 60%, prevents death |
| 116849 | Life Cocoon | Monk | Mistweaver | Absorbs damage and increases healing received |
| 33206 | Pain Suppression | Priest | Discipline | Reduces damage taken by 40% for 8 sec |
| 6940 | Blessing of Sacrifice | Paladin | All | Transfers damage from target to paladin |

## Usage in WCL

These spell sets can be used in Warcraft Logs expressions to filter events:

### Example: Track all raid defensive cooldowns
```
ability.id IN (97462, 196718, 51052, 98008, 62618, 31821)
```

### Example: Track healing cooldowns from a specific player
```
source.name = "PlayerName" AND ability.id IN (740, 197721, 115310, 31821, 62618, 64843, 265202, 114052, 108280, 98008, 363534, 355936)
```

### Example: Track external defensives on the main tank
```
target.name = "TankName" AND ability.id IN (102342, 47788, 116849, 33206, 6940)
```

## How to Use with Expression Helper

1. Open the Expression Helper at `http://localhost:3000/expression-helper.html`
2. Click on one of the cooldown set examples on the right side
3. The expression will be auto-generated and ready to copy
4. Paste into WCL's filter field when viewing reports or creating pins

## References

- [WCL Expression Documentation](https://www.archon.gg/wow/articles/help/intro-to-expressions)
- [Wowhead Spell Database](https://www.wowhead.com/spells)
