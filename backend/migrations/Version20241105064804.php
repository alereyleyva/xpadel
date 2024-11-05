<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241105064804 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create PlayerProfile entity';
    }

    public function up(Schema $schema): void
    {
        $this->addSql(
            <<< SQL
                CREATE TABLE xpadel.player_profile (
                    id UUID DEFAULT gen_random_uuid() NOT NULL,
                    user_id UUID NOT NULL,
                    level DOUBLE PRECISION,
                    dominant_hand TEXT NOT NULL,
                    position TEXT NOT NULL,
                    PRIMARY KEY(id)
                )
            SQL
        );

        $this->addSql('CREATE UNIQUE INDEX UNIQ_E0A3554AA76ED395 ON xpadel.player_profile (user_id)');

        $this->addSql('ALTER TABLE xpadel.player_profile ADD CONSTRAINT FK_E0A3554AA76ED395 FOREIGN KEY (user_id) REFERENCES "xpadel"."user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');

        $this->addSql('COMMENT ON COLUMN xpadel.player_profile.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN xpadel.player_profile.user_id IS \'(DC2Type:uuid)\'');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE xpadel.player_profile DROP CONSTRAINT FK_E0A3554AA76ED395');

        $this->addSql('DROP TABLE xpadel.player_profile');
    }
}
