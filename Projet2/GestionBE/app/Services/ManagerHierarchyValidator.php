<?php

namespace App\Services;

use App\Models\Employe;

class ManagerHierarchyValidator
{
    public function validate(?int $employeId, ?int $managerId): ?string
    {
        if (empty($managerId)) {
            return null;
        }

        $manager = Employe::with(['departements:id', 'poste:id,grade_id,niveau'])
            ->select('id', 'manager_id', 'departement_id', 'poste_id', 'active')
            ->find($managerId);

        if (!$manager) {
            return 'Le manager sélectionné est introuvable.';
        }

        if ((int) ($manager->active ?? 0) !== 1) {
            return 'Le manager sélectionné doit être un employé actif.';
        }

        if (!empty($employeId) && (int) $employeId === (int) $managerId) {
            return 'Un employé ne peut pas être son propre manager.';
        }

        if (empty($employeId)) {
            return null;
        }

        $employe = Employe::with(['departements:id', 'poste:id,grade_id,niveau'])
            ->select('id', 'manager_id', 'departement_id', 'poste_id')
            ->find($employeId);

        if (!$employe) {
            return 'Employé introuvable pour la validation du manager.';
        }

        $employeDeptIds = collect([$employe->departement_id])
            ->merge($employe->departements->pluck('id'))
            ->filter()
            ->unique()
            ->values();

        $managerDeptIds = collect([$manager->departement_id])
            ->merge($manager->departements->pluck('id'))
            ->filter()
            ->unique()
            ->values();

        if ($employeDeptIds->isNotEmpty() && $managerDeptIds->isNotEmpty()) {
            $shared = $employeDeptIds->intersect($managerDeptIds);
            if ($shared->isEmpty()) {
                return 'Le manager direct doit appartenir au même département que l\'employé.';
            }
        }

        $employeRank = $this->resolveRank($employe->poste);
        $managerRank = $this->resolveRank($manager->poste);

        if ($employeRank !== null && $managerRank !== null) {
            if ($managerRank <= $employeRank) {
                return 'Le manager doit avoir un niveau hiérarchique supérieur à celui de l\'employé.';
            }
        } elseif (!empty($employe->poste?->grade_id) && !empty($manager->poste?->grade_id)) {
            if ((int) $manager->poste->grade_id <= (int) $employe->poste->grade_id) {
                return 'Le manager doit avoir un grade supérieur à celui de l\'employé.';
            }
        }

        if ($this->createsCycle($employeId, $managerId)) {
            return 'Boucle hiérarchique interdite : ce manager crée une chaîne circulaire.';
        }

        return null;
    }

    private function createsCycle(int $employeId, int $managerId): bool
    {
        $visited = [];
        $cursor = $managerId;
        $limit = 100;

        while ($cursor && $limit-- > 0) {
            if ((int) $cursor === (int) $employeId) {
                return true;
            }

            if (isset($visited[$cursor])) {
                return true;
            }
            $visited[$cursor] = true;

            $next = Employe::select('id', 'manager_id')->find($cursor);
            if (!$next) {
                return false;
            }

            $cursor = $next->manager_id;
        }

        return false;
    }

    private function resolveRank($poste): ?int
    {
        if (!$poste) {
            return null;
        }

        $niveau = $poste->niveau ?? null;
        if (is_numeric($niveau)) {
            return (int) $niveau;
        }

        if (is_string($niveau) && preg_match('/(\d+)/', $niveau, $matches)) {
            return (int) $matches[1];
        }

        return null;
    }
}
