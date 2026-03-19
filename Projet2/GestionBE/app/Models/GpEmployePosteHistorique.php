<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GpEmployePosteHistorique extends Model
{
    use HasFactory;

    protected $table = 'gp_employe_poste_historiques';

    protected $fillable = [
        'employe_id',
        'poste_id',
        'grade_id',
        'date_debut',
        'date_fin',
        'type_evolution',
        'statut',
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class, 'employe_id');
    }

    public function poste()
    {
        return $this->belongsTo(Poste::class, 'poste_id');
    }

    public function grade()
    {
        return $this->belongsTo(GpGrade::class, 'grade_id');
    }

    /**
     * Calcule automatiquement le type d'évolution selon les règles métier RH
     * 
     * @param int $employeId
     * @param int $newPosteId
     * @param int $newGradeId
     * @param string|null $context 'suggestion' pour les propositions via AI
     * @return string Le type d'évolution calculé
     */
    public static function calculateTypeEvolution($employeId, $newPosteId, $newGradeId, $context = null)
    {
        // Si c'est une proposition via suggestion AI (avant validation)
        if ($context === 'suggestion') {
            return 'Proposition interne';
        }

        // Récupérer le poste actif de l'employé (date_fin = NULL)
        $currentHistorique = static::where('employe_id', $employeId)
            ->whereNull('date_fin')
            ->with(['poste.grade', 'grade'])
            ->first();

        // 1️⃣ Première affectation - Aucun poste actif existant
        if (!$currentHistorique) {
            return 'Affectation';
        }

        $currentGrade = $currentHistorique->grade ?: ($currentHistorique->poste?->grade ?: null);
        $newGrade = GpGrade::find($newGradeId);

        $currentOrdre = (int) ($currentGrade?->ordre ?? 0);
        $newOrdre = (int) ($newGrade?->ordre ?? 0);

        if ($newOrdre > $currentOrdre) {
            return 'Promotion';
        }

        if ($newOrdre < $currentOrdre) {
            return 'Rétrogradation';
        }

        return 'Mutation';
    }

    /**
     * Crée une nouvelle ligne d'historique avec calcul automatique du type_evolution
     * 
     * @param array $data Données de base (employe_id, poste_id, grade_id, date_debut, date_fin, statut)
     * @param string|null $context Context optionnel ('suggestion', etc.)
     * @return GpEmployePosteHistorique
     */
    public static function createWithAutoType(array $data, $context = null)
    {
        $data['type_evolution'] = static::calculateTypeEvolution(
            $data['employe_id'],
            $data['poste_id'],
            $data['grade_id'],
            $context
        );

        return static::create($data);
    }
}
