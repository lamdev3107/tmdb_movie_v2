import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import {
  catchError,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  CastJob,
  CrewJob,
  PersonDetail,
} from '@features/client/people/models/person.model';
import { PeopleService } from '../../services/people.service';

interface ApiState<T> {
  loading: boolean;
  data?: T;
  error?: any;
}

@Component({
  selector: 'app-people-detail',
  templateUrl: './people-detail.component.html',
  styleUrls: ['./people-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleDetailComponent {
  personState$!: Observable<ApiState<PersonDetail>>;
  knownForState$!: Observable<ApiState<any>>;
  creditState$!: Observable<
    ApiState<{ crewJobs: Record<string, CrewJob[]>; castJobs: CastJob[] }>
  >;
  showFullBio = false;
  sortedCastJob: CastJob[] = [];
  sortedCrewJob: CrewJob[] = [];

  constructor(
    private peopleService: PeopleService,
    private route: ActivatedRoute
  ) {
    const personId$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      shareReplay(1)
    );

    // Person detail state
    this.personState$ = personId$.pipe(
      switchMap((id) =>
        this.peopleService.getPersonDetail(id).pipe(
          map((data) => ({ loading: false, data } as ApiState<PersonDetail>)),
          startWith({ loading: true } as ApiState<PersonDetail>),
          catchError((error) =>
            of({ loading: false, error } as ApiState<PersonDetail>)
          )
        )
      )
    );

    // Known for state
    this.knownForState$ = personId$.pipe(
      switchMap((id) =>
        this.peopleService.getKnownFor(id).pipe(
          map((data) => {
            console.log('Check data', data);
            return { loading: false, data } as ApiState<any>;
          }),
          startWith({ loading: true } as ApiState<any>),
          catchError((error) => of({ loading: false, error } as ApiState<any>))
        )
      )
    );

    // Combined credit state
    this.creditState$ = personId$.pipe(
      switchMap((id) =>
        this.peopleService.getPersonCombinedCredit(id).pipe(
          map((res) => {
            this.sortedCastJob = res.cast.sort((a: any, b: any) => {
              // Ưu tiên dùng release_date, nếu không có thì fallback sang first_air_date
              const dateA = a.release_date
                ? new Date(a.release_date)
                : a.first_air_date
                ? new Date(a.first_air_date)
                : null;
              const dateB = b.release_date
                ? new Date(b.release_date)
                : b.first_air_date
                ? new Date(b.first_air_date)
                : null;

              if (dateA && dateB) {
                return dateB.getTime() - dateA.getTime();
              }
              if (dateA) return -1;
              if (dateB) return 1;
              return 0;
            });
            return {
              loading: false,
              data: {
                crewJobs: this.groupCrewByJob(res.crew),
                castJobs: res.cast,
              },
            } as ApiState<{
              crewJobs: Record<string, CrewJob[]>;
              castJobs: CastJob[];
            }>;
          }),
          startWith({ loading: true } as ApiState<{
            crewJobs: Record<string, CrewJob[]>;
            castJobs: CastJob[];
          }>),
          catchError((error) =>
            of({ loading: false, error } as ApiState<{
              crewJobs: Record<string, CrewJob[]>;
              castJobs: CastJob[];
            }>)
          )
        )
      )
    );
  }

  renderCastLink(item: any) {
    if (item.media_type === 'tv') {
      return `/tv_shows/details/${item.id}`;
    }
    return `/movies/details/${item.id}`;
  }
  renderKnowForLink(knownFor: any) {
    if (knownFor.media_type === 'movie') {
      return './movies/details/' + knownFor.id;
    }
    return '/tv_shows/details/' + knownFor.id;
  }
  renderAlsoKnownAs(alsoKnownAs: string[] | undefined) {
    if (!alsoKnownAs) return '';
    return alsoKnownAs.join(', ');
  }
  calculateAge(birthday: string | undefined | null) {
    if (!birthday) return 0;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  renderCastJob(item: any) {
    if (item.media_type === 'movie') {
      return {
        id: item.id,
        title: item.title,
        character: item.character,
        date: item.release_date,
      };
    }
    return {
      id: item.id,
      title: item.name,
      character: item.character,
      date: item.first_air_date,
    };
  }
  renderGender(gender: number | undefined) {
    if (gender === 1) {
      return 'Female';
    }
    if (gender === 2) {
      return 'Male';
    }
    return 'Others';
  }

  private groupCrewByJob(crew: CrewJob[]): Record<string, CrewJob[]> {
    return crew.reduce((acc, item) => {
      const job = item.job;
      if (!acc[job]) acc[job] = [];
      acc[job].push(item);
      return acc;
    }, {} as Record<string, CrewJob[]>);
  }
}
