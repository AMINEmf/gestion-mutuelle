<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // ============================================
        // ÉTAPE 1 : Ajouter les nouvelles colonnes
        // ============================================
        Schema::table('mutuelle_operations', function (Blueprint $table) {
            // Relation vers affiliation
            $table->unsignedBigInteger('affiliation_id')->nullable()->after('id');
            
            // Nouvelles informations
            $table->string('numero_dossier', 191)->nullable()->after('affiliation_id');
            
            // Informations bénéficiaire
            $table->enum('beneficiaire_type', ['EMPLOYE', 'CONJOINT', 'ENFANT'])
                  ->default('EMPLOYE')
                  ->after('numero_dossier');
            $table->string('beneficiaire_nom', 191)->nullable()->after('beneficiaire_type');
            
            // Nouveaux champs financiers
            $table->decimal('montant_total', 10, 2)->nullable()->after('statut');
            $table->decimal('montant_rembourse', 10, 2)->default(0)->after('montant_total');
            $table->decimal('reste_a_charge', 10, 2)->nullable()->after('montant_rembourse');
            
            // Workflow dates
            $table->date('date_depot')->nullable()->after('date_operation');
            $table->date('date_remboursement')->nullable()->after('date_depot');
            
            // Commentaire (remplace notes)
            $table->text('commentaire')->nullable()->after('reste_a_charge');
        });

        // ============================================
        // ÉTAPE 2 : Backfill des données existantes
        // ============================================
        
        // Migrer notes vers commentaire
        DB::statement('UPDATE mutuelle_operations SET commentaire = notes WHERE notes IS NOT NULL');
        
        // Migrer montant vers montant_total
        DB::statement('UPDATE mutuelle_operations SET montant_total = montant WHERE montant IS NOT NULL');
        
        // Backfill affiliation_id pour chaque opération existante
        $operations = DB::table('mutuelle_operations')
            ->whereNull('affiliation_id')
            ->select('id', 'employe_id')
            ->get();

        foreach ($operations as $operation) {
            // Trouver l'affiliation la plus pertinente pour cet employé
            // Priorité : ACTIVE > plus récente (date_adhesion desc, sinon id desc)
            $affiliation = DB::table('affiliations_mutuelle')
                ->where('employe_id', $operation->employe_id)
                ->orderByRaw("CASE WHEN statut = 'ACTIVE' THEN 0 ELSE 1 END")
                ->orderBy('date_adhesion', 'desc')
                ->orderBy('id', 'desc')
                ->first();

            if ($affiliation) {
                DB::table('mutuelle_operations')
                    ->where('id', $operation->id)
                    ->update(['affiliation_id' => $affiliation->id]);
            }
        }

        // ============================================
        // ÉTAPE 3 : Contraintes et index
        // ============================================
        Schema::table('mutuelle_operations', function (Blueprint $table) {
            // Rendre affiliation_id NOT NULL (si toutes les lignes ont été remplies)
            $nullCount = DB::table('mutuelle_operations')->whereNull('affiliation_id')->count();
            if ($nullCount === 0) {
                $table->unsignedBigInteger('affiliation_id')->nullable(false)->change();
            }
            
            // Foreign key
            $table->foreign('affiliation_id')
                  ->references('id')
                  ->on('affiliations_mutuelle')
                  ->onDelete('restrict');
            
            // Index pour performance (avec longueur limitée pour MySQL sur colonnes string)
            $table->index('date_operation');
        });
        
        // Créer les index sur colonnes string avec longueur limitée
        DB::statement('CREATE INDEX mutuelle_operations_numero_dossier_index ON mutuelle_operations (numero_dossier(191))');
        DB::statement('CREATE INDEX mutuelle_operations_statut_index ON mutuelle_operations (statut(50))');

        // ============================================
        // ÉTAPE 4 : Supprimer les anciennes colonnes
        // ============================================
        Schema::table('mutuelle_operations', function (Blueprint $table) {
            // Supprimer la FK employe_id d'abord
            $table->dropForeign(['employe_id']);
            $table->dropColumn(['employe_id', 'montant', 'notes']);
        });
    }

    public function down(): void
    {
        // Restauration : recréer les anciennes colonnes
        Schema::table('mutuelle_operations', function (Blueprint $table) {
            // Recréer employe_id
            $table->unsignedBigInteger('employe_id')->nullable()->after('id');
            $table->decimal('montant', 12, 2)->nullable();
            $table->text('notes')->nullable();
        });

        // Restaurer les données depuis affiliation
        $operations = DB::table('mutuelle_operations')
            ->whereNotNull('affiliation_id')
            ->select('id', 'affiliation_id', 'montant_total', 'commentaire')
            ->get();

        foreach ($operations as $operation) {
            $affiliation = DB::table('affiliations_mutuelle')
                ->where('id', $operation->affiliation_id)
                ->first();

            if ($affiliation) {
                DB::table('mutuelle_operations')
                    ->where('id', $operation->id)
                    ->update([
                        'employe_id' => $affiliation->employe_id,
                        'montant' => $operation->montant_total,
                        'notes' => $operation->commentaire,
                    ]);
            }
        }

        // Recréer la FK
        Schema::table('mutuelle_operations', function (Blueprint $table) {
            $table->foreign('employe_id')->references('id')->on('employes')->onDelete('cascade');
        });

        // Supprimer les nouvelles colonnes
        Schema::table('mutuelle_operations', function (Blueprint $table) {
            $table->dropForeign(['affiliation_id']);
        });
        
        // Supprimer les index personnalisés
        DB::statement('DROP INDEX IF EXISTS mutuelle_operations_numero_dossier_index ON mutuelle_operations');
        DB::statement('DROP INDEX IF EXISTS mutuelle_operations_statut_index ON mutuelle_operations');
        
        Schema::table('mutuelle_operations', function (Blueprint $table) {
            $table->dropColumn([
                'affiliation_id',
                'numero_dossier',
                'beneficiaire_type',
                'beneficiaire_nom',
                'montant_total',
                'montant_rembourse',
                'reste_a_charge',
                'date_depot',
                'date_remboursement',
                'commentaire'
            ]);
        });
    }
};
