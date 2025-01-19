import {pool} from "../db.js";

export async function getUnreadCounts(userId: number) {
    const query = `
        SELECT
            sender_id,
            COUNT(*) AS unread_count
        FROM
            messages
        WHERE
            recipient_id = $1 AND (seen = FALSE OR seen IS NULL)
        GROUP BY
            sender_id;
    `;
    const values = [userId];
    const { rows } = await pool.query(query, values);
    return rows || [];
}