import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('daily_page_views')
export class DailyPageViews {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, type: 'varchar', length: 255 })
    page: string;

    @Column({ nullable: false, type: 'int' })
    count: number;

    @Column({ nullable: false, type: 'date' })
    view_date: Date;
}