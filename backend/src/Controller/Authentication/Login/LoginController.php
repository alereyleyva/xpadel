<?php

namespace App\Controller\Authentication\Login;

use App\Controller\Authentication\AuthenticationResult;
use App\Entity\User;
use App\Exception\HttpExceptionHandler;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class LoginController extends AbstractController
{
    public function __construct(
        private readonly JWTTokenManagerInterface $tokenManager,
        private readonly HttpExceptionHandler     $httpExceptionHandler,
    ) {}

    #[Route('/api/login', name: 'app_login', methods: ['POST'])]
    public function index(#[CurrentUser] ?User $user): JsonResponse
    {
        try {
            if (null === $user) {
                throw new \RuntimeException('Credenciales incorrectas', Response::HTTP_UNAUTHORIZED);
            }

            $accessToken = $this->tokenManager->create($user);
            $authenticationResult = new AuthenticationResult($accessToken);

            return $this->json($authenticationResult, Response::HTTP_OK);
        } catch (\Throwable $exception) {
            $processedException = $this->httpExceptionHandler->processException($exception);

            return $this->json([
                'error' => $processedException->getMessage()
            ], $processedException->getStatusCode());
        }
    }
}
