<?php declare(strict_types=1);

namespace App\Command\CreateUser;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsMessageHandler]
readonly class CreateUserHandler
{
    public function __construct(
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $passwordHasher,
    ) {}

    public function __invoke(CreateUserCommand $command): User
    {
        if ($this->userRepository->existsByEmail($command->email)) {
            throw new \RuntimeException(
                'Ya existe un usuario con el email proporcionado',
                Response::HTTP_BAD_REQUEST
            );
        }

        $user = new User($command->email);

        if (null !== $command->password) {
            $this->hashUserPassword($user, $command->password);
        }

        $this->userRepository->save($user);

        return $user;
    }

    public function hashUserPassword(User $user, string $plainPassword): void
    {
        $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);

        $user->setPassword($hashedPassword);
    }
}
