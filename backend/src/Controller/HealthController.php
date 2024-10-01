<?php declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class HealthController extends AbstractController
{
    #[Route('/api/health', name: 'app_health')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'XPadel API is up and running',
        ]);
    }
}
