<?php declare(strict_types=1);

namespace App\Entity\Enum;

enum PlayerDominantHand: string
{
    case RIGHT_HANDED = 'RightHanded';
    case LEFT_HANDED = 'LeftHanded';
    case UNKNOWN = 'Unknown';
}
