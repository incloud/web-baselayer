import { Field, ID, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from '../enum/Gender';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('varchar', { length: 255, nullable: false, unique: true })
  email: string;

  @Field()
  @Column('varchar', { length: 255, nullable: false })
  firstName: string;

  @Field()
  @Column('varchar', { length: 255, nullable: false })
  lastName: string;

  @Field()
  @Column('varchar', { length: 255, nullable: false })
  phoneNumber: string;

  @Field(() => Int)
  @Column('integer', { nullable: false })
  birthYear: number;

  @Field(() => Gender)
  @Column('enum', { enum: Gender, nullable: false })
  gender: Gender;

  @Column('varchar', { length: 255, nullable: false })
  password: string;

  @Column('boolean', { nullable: false })
  acceptedTermsAndConditions: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  canonicalizeEmail() {
    this.email = this.email.toLowerCase();
  }
}
