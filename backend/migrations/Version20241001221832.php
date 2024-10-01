<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241001221832 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add created_at property to User entity';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE xpadel."user" ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL');
        $this->addSql('COMMENT ON COLUMN xpadel."user".created_at IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE "xpadel"."user" DROP created_at');
    }
}
