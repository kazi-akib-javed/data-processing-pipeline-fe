import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('page_views')
export class PageViews{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ primary: true, unique: true, nullable: false, type: 'varchar', length: 255 })
    page: string;

    @Column({ nullable: false, type: 'int' })
    count: number;

    @Column({ nullable: false, type: 'timestamp' })
    last_updated: Date;
}