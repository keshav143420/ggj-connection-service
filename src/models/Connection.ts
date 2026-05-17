import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

@Entity("connections")
@Index(["followerId", "followingId"], { unique: true })
export class Connection {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    followerId!: string;

    @Column()
    followingId!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
