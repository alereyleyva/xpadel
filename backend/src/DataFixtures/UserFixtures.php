<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    private const array USERS = [
        [
            'email' => 'admin@xpadel.com',
            'password' => 'password',
            'roles' => ['ROLE_ADMIN']
        ],
        [
            'email' => 'user@xpadel.com',
            'password' => 'password',
            'roles' => []
        ]
    ];

    public function __construct(private readonly UserPasswordHasherInterface $passwordHasher) {}

    public function load(ObjectManager $manager): void
    {
        foreach (self::USERS as $userData) {
            $user = new User($userData['email']);

            $hashedPassword = $this->passwordHasher->hashPassword($user, $userData['password']);

            $user->setPassword($hashedPassword);
            $user->setRoles($userData['roles']);

            $manager->persist($user);
        }

        $manager->flush();
    }
}
