<?php

namespace App\Controller\Authentication\Registration;

use App\Command\CreateUser\CreateUserCommand;
use App\Controller\Authentication\AuthenticationResult;
use App\Exception\HttpExceptionHandler;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\HandledStamp;
use Symfony\Component\Routing\Attribute\Route;

class RegisterController extends AbstractController
{
    public function __construct(
        private readonly MessageBusInterface      $messageBus,
        private readonly HttpExceptionHandler     $httpExceptionHandler,
        private readonly JWTTokenManagerInterface $tokenManager
    ) {}

    #[Route('/api/register', name: 'app_register', methods: ['POST'])]
    public function index(#[MapRequestPayload] RegisterPayload $registerPayload): JsonResponse
    {
        try {
            $email = $registerPayload->email;
            $password = $registerPayload->password;

            $command = new CreateUserCommand($email, $password);

            $envelope = $this->messageBus->dispatch($command);

            $handledStamp = $envelope->last(HandledStamp::class);

            if (null === $handledStamp) {
                throw new \RuntimeException('Error procesando el registro de usuario');
            }

            $user = $handledStamp->getResult();

            $accessToken = $this->tokenManager->create($user);
            $authenticationResult = new AuthenticationResult($accessToken);

            return $this->json($authenticationResult, Response::HTTP_CREATED);
        } catch (\Throwable $exception) {
            $processedException = $this->httpExceptionHandler->processException($exception);

            return $this->json([
                'error' => $processedException->getMessage()
            ], $processedException->getStatusCode());
        }
    }


}
