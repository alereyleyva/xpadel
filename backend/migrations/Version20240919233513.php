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

        $this->addSql(
            <<< SQL
                CREATE TABLE "xpadel"."user" (
                    id UUID DEFAULT gen_random_uuid() NOT NULL,
                    email TEXT NOT NULL,
                    roles JSON NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    PRIMARY KEY(id)
                )
            SQL
        );

        $this->addSql('CREATE UNIQUE INDEX UNIQ_B2088837E7927C74 ON "xpadel"."user" (email)');

        $this->addSql('COMMENT ON COLUMN "xpadel"."user".id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN "xpadel"."user".created_at IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE "xpadel"."user"');

        $this->addSql('DROP SCHEMA xpadel');
    }
}
