<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class LogoutController extends AbstractController
{
    #[Route('/admin/logout', name: 'admin_logout', methods: ['GET'])]
    public function logout(): void
    {
        throw new \RuntimeException('Don\'t forget to activate logout in security.yaml');
    }
}
