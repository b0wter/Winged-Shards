export enum Manufacturers {
    /**
     * Fallback if no manufacturer is available.
     */
    Dummy,
    BattlePrep,
    RegalForce,
    CosmicStrike,
    Gunnerr,
    Rhino,
    SavageReaper,
    AllSeeingEye,
    TAP,
    CyberFanatics,
    RobotOrbit,
    Tiangong,
    Roskosmos,
    Fist
}

export function manufacturerToString(m: Manufacturers)
{
    switch(m)
    {
        case Manufacturers.AllSeeingEye: return "All-Seeing-Eye"
        case Manufacturers.BattlePrep: return "BATTLEPREP"
        case Manufacturers.CosmicStrike: return "Cosmic Strike"
        case Manufacturers.CyberFanatics: return "cyber fanatics"
        case Manufacturers.Gunnerr: return "gunnerr"
        case Manufacturers.RegalForce: return "regalforce"
        case Manufacturers.Rhino: return "Rhino"
        case Manufacturers.SavageReaper: return "Savage Reaper"
        case Manufacturers.TAP: return "TAP"
        case Manufacturers.RobotOrbit: return "Robot Orbit"
        case Manufacturers.Tiangong: return "TIANGONG"
        case Manufacturers.Roskosmos: return "ROSKOSMOS"
        case Manufacturers.Fist: return "FIST"

        default: return "Unknown Manufacturer"
    }
}