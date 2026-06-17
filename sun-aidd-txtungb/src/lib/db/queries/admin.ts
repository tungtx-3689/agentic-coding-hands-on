import "server-only";
import { db } from "../index";

export type DepartmentStat = {
  no: number;
  unit: string;
  totalMember: number;
  totalSentKudos: number;
  totalReceivedKudos: number;
  totalUserHaveAtleastKudos: number;
  totalReceivedSecretBox: number;
};

type RawRow = {
  unit: string;
  total_member: number;
  total_sent_kudos: number;
  total_received_kudos: number;
  total_user_have_atleast_kudos: number;
  total_received_secret_box: number;
};

export async function getDepartmentStats(): Promise<DepartmentStat[]> {
  const rows = db.$client.prepare(`
    SELECT
      d.name AS unit,
      COUNT(DISTINCT p.id) AS total_member,
      COALESCE(SUM(p.kudos_sent_count), 0) AS total_sent_kudos,
      COALESCE(SUM(p.kudos_received_count), 0) AS total_received_kudos,
      COUNT(CASE WHEN p.kudos_received_count > 0 THEN 1 END) AS total_user_have_atleast_kudos,
      (
        SELECT COUNT(*) FROM secret_boxes sb
        INNER JOIN profiles pp ON pp.id = sb.user_id
        WHERE pp.department_id = d.id
      ) AS total_received_secret_box
    FROM departments d
    LEFT JOIN profiles p ON p.department_id = d.id
    GROUP BY d.id, d.name
    ORDER BY d.name
  `).all() as RawRow[];

  return rows.map((r, i) => ({
    no: i + 1,
    unit: r.unit,
    totalMember: r.total_member,
    totalSentKudos: r.total_sent_kudos,
    totalReceivedKudos: r.total_received_kudos,
    totalUserHaveAtleastKudos: r.total_user_have_atleast_kudos,
    totalReceivedSecretBox: r.total_received_secret_box,
  }));
}
