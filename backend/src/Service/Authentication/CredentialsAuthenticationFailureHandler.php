<?php declare(strict_types=1);

namespace App\Service\Authentication;

use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication\AuthenticationFailureHandler;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException as SecurityAuthenticationException;

class CredentialsAuthenticationFailureHandler extends AuthenticationFailureHandler
{
    public function onAuthenticationFailure(Request $request, SecurityAuthenticationException $exception): Response
    {
        $credentialsException = new \RuntimeException(
            'Credenciales incorrectas',
            Response::HTTP_UNAUTHORIZED
        );

        return new JsonResponse([
            'error' => $credentialsException->getMessage(),
        ], $credentialsException->getCode());
    }
}
