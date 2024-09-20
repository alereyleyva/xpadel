<?php

namespace App\Controller\Registration;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class RegisterController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private JWTTokenManagerInterface $tokenManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {}
    #[Route('/api/register', name: 'app_register', methods: ['POST'])]
    public function index(#[MapRequestPayload] RegisterPayload $registerPayload): JsonResponse
    {
        $email = $registerPayload->email;
        $password = $registerPayload->password;

        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (null !== $user) {
            return $this->json(['error' => 'Usuario ya existente con el email proporcionado'], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setEmail($email);

        $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json([
            'accessToken' => $this->tokenManager->create($user),
        ], Response::HTTP_CREATED);
    }
}
