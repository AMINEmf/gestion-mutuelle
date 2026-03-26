<?php

namespace App\Services;

use App\Models\Employe;
use Illuminate\Support\Collection;

class ManagerAutoAssignService
{
    public function __construct(private readonly ManagerHierarchyValidator $validator)
    {
    }

    public function suggestManagerId(Employe $employe): ?int
    {
        $candidates = $this->buildCandidatePool($employe, true);

        foreach ($candidates as $candidate) {
            $error = $this->validator->validate((int) $employe->id, (int) $candidate->id);
            if ($error === null) {
                return (int) $candidate->id;
            }
        }

        return null;
    }

    public function suggestFallbackManagerId(Employe $employe): ?int
    {
        $candidates = Employe::query()
            ->select('id', 'active')
            ->withCount('subordonnes')
            ->where('id', '!=', $employe->id)
            ->orderByDesc('active')
            ->orderBy('subordonnes_count')
            ->orderBy('id')
            ->get();

        return $candidates->first()?->id;
    }

    private function buildCandidatePool(Employe $employe, bool $onlyActive = true): Collection
    {
        $query = Employe::query()
            ->with(['departements:id', 'poste:id,grade_id,niveau'])
            ->withCount('subordonnes')
            ->select('id', 'departement_id', 'poste_id', 'active')
            ->where('id', '!=', $employe->id);

        if ($onlyActive) {
            $query->where('active', 1);
        }

        $candidates = $query->get();

        $employeDeptIds = $this->deptIds($employe);
        $employeRank = $this->rank($employe);

        return $candidates
            ->map(function (Employe $candidate) use ($employeDeptIds, $employeRank) {
                $candidateDeptIds = $this->deptIds($candidate);
                $sameDept = $employeDeptIds->isNotEmpty() && $candidateDeptIds->isNotEmpty()
                    ? $employeDeptIds->intersect($candidateDeptIds)->isNotEmpty()
                    : false;

                $candidateRank = $this->rank($candidate);
                $higherRank = $employeRank !== null && $candidateRank !== null
                    ? ($candidateRank > $employeRank)
                    : false;

                return [
                    'candidate' => $candidate,
                    'same_dept' => $sameDept ? 1 : 0,
                    'higher_rank' => $higherRank ? 1 : 0,
                    'rank' => $candidateRank ?? -1,
                    'subordonnes_count' => (int) ($candidate->subordonnes_count ?? 0),
                ];
            })
            ->sort(function (array $a, array $b) {
                return [$b['same_dept'], $b['higher_rank'], $b['rank'], $a['subordonnes_count'], $a['candidate']->id]
                    <=>
                    [$a['same_dept'], $a['higher_rank'], $a['rank'], $b['subordonnes_count'], $b['candidate']->id];
            })
            ->values()
            ->map(fn (array $row) => $row['candidate']);
    }

    private function deptIds(Employe $employe): Collection
    {
        return collect([$employe->departement_id])
            ->merge($employe->departements?->pluck('id') ?? [])
            ->filter()
            ->unique()
            ->values();
    }

    private function rank(Employe $employe): ?int
    {
        $poste = $employe->poste;
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

        if (!empty($poste->grade_id)) {
            return (int) $poste->grade_id;
        }

        return null;
    }
}
