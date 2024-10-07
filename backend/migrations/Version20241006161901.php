<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241006161901 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create UserProfile entity';
    }

    public function up(Schema $schema): void
    {
        $this->addSql(
            <<< SQL
                CREATE TABLE xpadel.user_profile (
                    id UUID DEFAULT gen_random_uuid() NOT NULL,
                    user_id UUID NOT NULL,
                    avatar TEXT DEFAULT NULL,
                    first_name TEXT DEFAULT NULL,
                    last_name TEXT DEFAULT NULL,
                    phone_number TEXT DEFAULT NULL,
                    instagram_account TEXT DEFAULT NULL,
                    PRIMARY KEY(id)
                )
            SQL
        );

        $this->addSql('CREATE UNIQUE INDEX UNIQ_47BA6C9AA76ED395 ON xpadel.user_profile (user_id)');
        $this->addSql('ALTER TABLE xpadel.user_profile ADD CONSTRAINT FK_47BA6C9AA76ED395 FOREIGN KEY (user_id) REFERENCES "xpadel"."user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');

        $this->addSql('CREATE UNIQUE INDEX UNIQ_47BA6C9A6B01BC5B ON xpadel.user_profile (phone_number)');

        $this->addSql('COMMENT ON COLUMN xpadel.user_profile.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN xpadel.user_profile.user_id IS \'(DC2Type:uuid)\'');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE xpadel.user_profile DROP CONSTRAINT FK_47BA6C9AA76ED395');

        $this->addSql('DROP TABLE xpadel.user_profile');
    }
}
