//pool faz a conexão com a lib do postgre
import { Pool } from 'pg'// se pg "reclamar" instale via terminal: yarn add @types/pg -D
import { Kysely, PostgresDialect, CamelCasePlugin } from 'kysely'

import { Mission, Reservation, Ticket } from './types'

//as tabelas no Supabase usa snake_case (caixa baixa com underscore)
//camel_Case é o padrão correto para TS e JS (atenção a essa diferença e tipagem)
interface Database {
    missions: Mission,
    reservations: Reservation,
    tickets: Ticket
}

const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString: process.env.DATABASE_URL,//credenciais no arquivo .env (não versionado)
        ssl: { rejectUnauthorized: false }//evita problemas de conexão em várias situações (ip, localização, VPN, etc)
    })
})

//exporta o db que vai ser um objeto Kysley qyue fará conexões com o banco
export const db = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()]//faz o kynsly tabalhar com CamelCase
})

export async function insertMission(mission: Mission) {
    await db
        .insertInto('missions')//seguir o contrato
        .values(mission)
        .execute()
}

export async function deleteMission(id: string) {
    await db
        .deleteFrom('missions')
        .where('id', '=', id)
        .execute()
}

export async function deleteReservation(mission_id: string) {
    await db
        .deleteFrom('reservations')
        .where('missionId', '=', mission_id)
        .execute()
}

export async function deleteTicket(mission_id: string) {
    await db
        .deleteFrom('tickets')
        .where('missionId', '=', mission_id)
        .execute()
}