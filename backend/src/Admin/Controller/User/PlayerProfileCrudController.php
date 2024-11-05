<?php

namespace App\Admin\Controller\User;

use App\Entity\Enum\PlayerDominantHand;
use App\Entity\Enum\PlayerPosition;
use App\Entity\PlayerProfile;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;

class PlayerProfileCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return PlayerProfile::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            NumberField::new('level'),
            ChoiceField::new('position')->setChoices(PlayerPosition::cases()),
            ChoiceField::new('dominantHand')->setChoices(PlayerDominantHand::cases())
        ];
    }
}
