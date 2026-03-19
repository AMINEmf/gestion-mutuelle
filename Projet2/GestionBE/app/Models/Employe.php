<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;




class Employe extends Model
{
    protected $fillable = [
        'matricule',
        'num_badge',
        'nom',
        'prenom',
        'lieu_naiss',
        'date_naiss',
        'cin',
        'cnss',
        'sexe',
        'situation_fm',
        'nb_enfants',
        'adresse',
        'ville',
        'pays',
        'code_postal',
        'tel',
        'fax',
        'email',
        'fonction',
        'nationalite',
        'niveau',
        'echelon',
        'categorie',
        'coeficients',
        'imputation',
        'date_entree',
        'date_embauche',
        'date_sortie',
        'salaire_base',
        'remarque',
        // 'pointage_auto',
        // 'regle_paiment',
        // 'famille_jour_ferie',
        // 'code_cal',
        'url_img',
        // 'numorder',
        // 'afficherEtats',
        'centreCout',
        'departement_id',
        'active',
        'delivree_par', 'date_expiration', 'carte_sejour', 'motif_depart',
        'dernier_jour_travaille', 'notification_rupture', 'engagement_procedure',
        'signature_rupture_conventionnelle', 'transaction_en_cours', 'bulletin_modele',
        'salaire_moyen', 'salaire_reference_annuel',
        'poste_id',
        'manager_id',
    ];
    public function departements()
    {
        return $this->belongsToMany(Departement::class , 'employe_departement', 'employe_id', 'departement_id');
    }
    public function contrat()
    {
        return $this->hasMany(Contrat::class);
    }

    public function cnssAffiliations()
    {
        return $this->hasMany(CnssAffiliation::class , 'employe_id');
    }

    public function cnssDocuments()
    {
        return $this->hasMany(CnssDocument::class , 'employe_id');
    }

    public function cnssOperations()
    {
        return $this->hasMany(CnssOperation::class , 'employe_id');
    }


    public function calendriersEmployes()
    {
        return $this->hasMany(GpCalendrierEmploye::class , 'employe_id');
    }

    public function bulletins()
    {
        return $this->hasMany(GpEmployeBulletin::class , 'employe_id');
    }

    public function bonSortie()
    {
        return $this->hasMany(GpBonSortie::class , 'employee_id');
    }
    public function gpConge()
    {
        return $this->hasOne(GpConge::class , 'employe_id');
    }

    public function latestCnssAffiliation()
    {
        return $this->hasOne(CnssAffiliation::class , 'employe_id')->latestOfMany('date_debut');
    }

    public function latestDeclarationDetail()
    {
        return $this->hasOne(CnssDeclarationDetail::class , 'employe_id')
            ->latest('id');
    }

    public function demandesConges()
    {
        return $this->hasMany(GpDemandeConge::class , 'employe_id');
    }

    public function poste()
    {
        return $this->belongsTo(Poste::class, 'poste_id');
    }

    public function manager()
    {
        return $this->belongsTo(self::class, 'manager_id');
    }

    public function subordonnes()
    {
        return $this->hasMany(self::class, 'manager_id');
    }

    public function posteHistoriques()
    {
        return $this->hasMany(GpEmployePosteHistorique::class, 'employe_id');
    }

    public function historiquePostes()
    {
        return $this->hasMany(GpEmployePosteHistorique::class, 'employe_id');
    }

    public function latestPosteHistorique()
    {
        return $this->hasOne(GpEmployePosteHistorique::class, 'employe_id')->latestOfMany('date_debut');
    }

    public function formations()
    {
        return $this->belongsToMany(Formation::class, 'formation_participants', 'employe_id', 'formation_id')
                    ->withPivot(['statut', 'note', 'commentaire', 'attestation'])
                    ->withTimestamps();
    }

    public function competences()
    {
        return $this->belongsToMany(GpCompetence::class, 'gp_employe_competence', 'employe_id', 'competence_id')
                    ->withPivot(['niveau', 'niveau_acquis', 'date_acquisition'])
                    ->withTimestamps();
    }

    protected static function booted()
    {
        static::created(function ($employe) {
            try {
                Log::info('[Employe booted] Début création gp_conges', [
                    'employe_id' => $employe->id,
                    'date_embauche' => $employe->date_embauche,
                ]);

                if ($employe->date_embauche) {
                    $dateEmbauche = \Carbon\Carbon::parse($employe->date_embauche);
                    $mois = now()->diffInMonths($dateEmbauche);

                    $joursCumules = $mois * 1.5;

                    $employe->gpConge()->create([
                        'jours_cumules' => $joursCumules,
                        'jours_consomes' => 0,
                        'solde_actuel' => $joursCumules,
                        'last_update' => now(),
                    ]);

                    Log::info('[Employe booted] gp_conges créé avec succès', [
                        'employe_id' => $employe->id,
                        'jours_cumules' => $joursCumules,
                        'solde_actuel' => $joursCumules,
                    ]);
                }
                else {
                    Log::warning('[Employe booted] Pas de date_embauche, gp_conges non créé', [
                        'employe_id' => $employe->id,
                    ]);
                }
            }
            catch (\Exception $e) {
                Log::error('[Employe booted] Erreur lors de la création de gp_conges', [
                    'employe_id' => $employe->id,
                    'message' => $e->getMessage(),
                    'stack' => $e->getTraceAsString(),
                ]);
            }
        });

        static::created(function ($employe) {
            self::ensureInitialHistorique($employe);
        });

        static::updated(function ($employe) {
            if ($employe->wasChanged('poste_id')) {
                self::ensureInitialHistorique($employe);
            }
        });
    }

    protected static function ensureInitialHistorique(self $employe): void
    {
        if (!$employe->poste_id) {
            return;
        }

        $exists = GpEmployePosteHistorique::where('employe_id', $employe->id)->exists();
        if ($exists) {
            return;
        }

        $poste = $employe->poste()->select('id', 'grade_id')->first();
        $gradeId = $poste?->grade_id;

        GpEmployePosteHistorique::create([
            'employe_id' => $employe->id,
            'poste_id' => $employe->poste_id,
            'grade_id' => $gradeId,
            'date_debut' => $employe->created_at ? $employe->created_at->toDateString() : now()->toDateString(),
            'date_fin' => null,
            'type_evolution' => 'Affectation',
        ]);
    }

}
