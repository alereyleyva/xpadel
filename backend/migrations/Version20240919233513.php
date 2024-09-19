<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20240919233513 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create User entity';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA xpadel');
        $this->addSql('CREATE TABLE "xpadel"."user" (id UUID DEFAULT gen_random_uuid() NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX user_email_idx ON "xpadel"."user" (email)');
        $this->addSql('COMMENT ON COLUMN "xpadel"."user".id IS \'(DC2Type:uuid)\'');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE "xpadel"."user"');
        $this->addSql('DROP SCHEMA xpadel');
    }
}
