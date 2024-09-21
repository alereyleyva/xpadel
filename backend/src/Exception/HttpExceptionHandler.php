<?php declare(strict_types=1);

namespace App\Exception;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Messenger\Exception\HandlerFailedException;

class HttpExceptionHandler
{
    private function processCommandExceptionMessage(HandlerFailedException $exception): string
    {
        return preg_replace('{Handling ".*" failed: }', '', $exception->getMessage());
    }

    public function processException(\Throwable $throwable): HttpException
    {
        $statusCode = $throwable->getCode() !== 0 ?
            $throwable->getCode() : Response::HTTP_INTERNAL_SERVER_ERROR;

        $message = $throwable->getMessage();

        if ($throwable instanceof HandlerFailedException) {
            $message = $this->processCommandExceptionMessage($throwable);
        }

        return new HttpException($statusCode, message: $message, previous: $throwable);
    }
}
