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
import { AdminPerson } from '@features/admin/people/models/admin-person.model';
import { PeopleService } from '@features/admin/people/services/people.service';
import { Movie } from '@features/client/movies/models/movie.model';

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
  personState$!: Observable<ApiState<AdminPerson>>;
  creditState$!: Observable<
    ApiState<{ crewJobs: Record<string, CrewJob[]>; castJobs: CastJob[] }>
  >;
  personMovies: Movie[] = [];
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
        this.peopleService.getPerson(id).pipe(
          map((data) => {
            this.personMovies = data.movies;
            return {
              loading: false,
              data: data.personDetail,
            } as ApiState<AdminPerson>;
          }),
          startWith({ loading: true } as ApiState<AdminPerson>),
          catchError((error) =>
            of({ loading: false, error } as ApiState<AdminPerson>)
          )
        )
      )
    );
  }

  renderCastLink(item: any) {
    return `/movies/details/${item.id}`;
  }
  renderKnowForLink(knownFor: any) {
    return './movies/details/' + knownFor.id;
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
  renderGender(gender: string | undefined) {
    if (gender === 'MALE') {
      return 'Male';
    }
    if (gender === 'FEMALE') {
      return 'FEMAIL';
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
