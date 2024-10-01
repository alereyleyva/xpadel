<?php declare(strict_types=1);

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController extends AbstractController
{
    #[Route('/admin/login', name: 'admin_login')]
    public function index(AuthenticationUtils $authenticationUtils): Response
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        $user = $this->getUser();

        if (null !== $user) {
            $userRoles = $user->getRoles();

            if (!in_array('ROLE_ADMIN', $userRoles)) {
                return $this->redirectToRoute('admin_logout');
            }

            return $this->redirectToRoute('admin');
        }

        return $this->render('@EasyAdmin/page/login.html.twig', [
            'error' => $error,
            'last_username' => $lastUsername,
            'page_title' => '<h1>XPadel Admin</h1>',
            'username_label' => 'Email',
            'csrf_token_intention' => 'authenticate',
            'target_path' => '/admin',
        ]);
    }
}
