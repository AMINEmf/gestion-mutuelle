<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormationAttendance;
use App\Models\FormationSession;
use Illuminate\Http\Request;

class FormationAttendanceController extends Controller
{
    /**
     * GET /sessions/{session}/attendance
     * List attendance rows for a session with employee info.
     * Returns ALL participants of the formation, with their attendance status if exists.
     */
    public function index(FormationSession $session)
    {
        // Get the formation
        $formation = $session->formation;
        
        if (!$formation) {
            return response()->json([
                'session'    => $session,
                'attendance' => [],
            ]);
        }

        // Get all participants enrolled in the formation
        $participants = $formation->participants()
            ->with(['employe:id,matricule,nom,prenom,departement_id', 'employe.departements:id,nom'])
            ->get();

        // Map through participants and attach their attendance record if exists
        $attendance = $participants->map(function ($participant) use ($session) {
            $emp = $participant->employe;
            
            // Find existing attendance record for this employee in this session
            $attendanceRecord = FormationAttendance::where('session_id', $session->id)
                ->where('employe_id', $participant->employe_id)
                ->first();

            return [
                'id'          => $attendanceRecord?->id,
                'employe_id'  => $participant->employe_id,
                'matricule'   => $emp?->matricule,
                'employe'     => trim(($emp?->nom ?? '') . ' ' . ($emp?->prenom ?? '')),
                'departement' => $emp?->departements?->first()?->nom ?? '',
                'statut'      => $attendanceRecord?->statut ?? 'Absent', // Default to Absent if no record
                'remarque'    => $attendanceRecord?->remarque,
            ];
        });

        return response()->json([
            'session'    => $session,
            'attendance' => $attendance,
        ]);
    }

    /**
     * POST /sessions/{session}/attendance/bulk-update
     * Update multiple attendance rows at once.
     *
     * Body: { rows: [{ employe_id, statut, remarque }, ...] }
     */
    public function bulkUpdate(Request $request, FormationSession $session)
    {
        $request->validate([
            'rows'                => 'required|array',
            'rows.*.employe_id'   => 'required|exists:employes,id',
            'rows.*.statut'       => 'required|string|in:Présent,Absent,Retard',
            'rows.*.remarque'     => 'nullable|string',
        ]);

        foreach ($request->rows as $row) {
            FormationAttendance::updateOrCreate(
                [
                    'session_id' => $session->id,
                    'employe_id' => $row['employe_id'],
                ],
                [
                    'statut'   => $row['statut'],
                    'remarque' => $row['remarque'] ?? null,
                ]
            );
        }

        return response()->json(['message' => 'Présences enregistrées']);
    }
}
