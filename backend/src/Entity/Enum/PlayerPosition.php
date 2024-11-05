<?php declare(strict_types=1);

namespace App\Entity\Enum;

enum PlayerPosition: string
{
    case BACKHAND = 'Backhand';
    case DRIVE = 'Drive';
    case BOTH = 'Both';
    case UNKNOWN = 'Unknown';
}
