const HOUSE_BRAVERY = 64;
const HOUSE_BRILLIANCE = 128;
const HOUSE_BALANCE = 256;

export default function(flags) {
    switch(true) {
        case (flags & HOUSE_BRAVERY) == HOUSE_BRAVERY:
            return 'bravery';
        case (flags & HOUSE_BRILLIANCE) == HOUSE_BRILLIANCE:
            return 'brilliance';
        case (flags & HOUSE_BALANCE) == HOUSE_BALANCE:
            return 'balance';
        default:
            return;
    }
}