<?php declare(strict_types=1);

namespace App\Controller\UserProfile;

use App\Entity\User;
use App\Repository\UserRepository;
use League\Flysystem\Filesystem;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class UpdateUserAvatarController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly Filesystem $filesystem,
    ) {}

    #[Route('/api/me/avatar', name: 'app_update_current_user_avatar', methods: 'POST')]
    public function index(
        Request $request,
        #[CurrentUser] ?User $user,
    ): JsonResponse
    {
        if (null === $user) {
            return $this->json([
                'error' => 'Unauthorized',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $userProfile = $user->getProfile();

        $avatar = $request->files->get('avatar');

        if (null !== $avatar) {
            $avatarSrc = $this->processUserAvatarUpload($avatar, $user);

            $userProfile->setAvatar($avatarSrc);

            $user->setProfile($userProfile);

            $this->userRepository->save($user);
        }

        return $this->json($user);
    }

    private function processUserAvatarUpload(UploadedFile $file, User $user): string
    {
        $fileExtension = $file->guessExtension();

        if (!in_array($fileExtension, ['jpg', 'jpeg', 'png'], true)) {
            throw new \RuntimeException('Formato de imagen incorrecto');
        }

        $filename = $user->getId();

        $content = file_get_contents($file->getPathname());

        $this->filesystem->write($filename, $content, [
            'ContentType' => $file->getMimeType(),
        ]);

        return $filename;
    }
}
