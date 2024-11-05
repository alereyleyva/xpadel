<?php

namespace App\Admin\Controller;

use App\Entity\UserProfile;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\TelephoneField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class UserProfileCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return UserProfile::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            TextField::new('firstName'),
            TextField::new('lastName'),
            TelephoneField::new('phoneNumber'),
            TextField::new('instagramAccount')
        ];
    }
}
