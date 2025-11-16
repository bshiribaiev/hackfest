import { useEffect, useState } from "react";
import { fetchStudentProfile, StudentProfile } from "@/lib/api";

export function useStudentProfile(studentId: number) {
  const [data, setData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const profile = await fetchStudentProfile(studentId);
        if (!cancelled) {
          setData(profile);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load profile");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [studentId, version]);

  const reload = () => setVersion(v => v + 1);

  return { data, loading, error, reload };
}


