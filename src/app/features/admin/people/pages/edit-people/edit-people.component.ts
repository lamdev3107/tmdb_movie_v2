import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PeopleService } from '../../services/people.service';
import { AdminPerson } from '../../models/admin-person.model';

@Component({
  selector: 'app-edit-people',
  templateUrl: './edit-people.component.html',
  styleUrls: ['./edit-people.component.scss'],
})
export class EditPeopleComponent implements OnInit {
  personData?: AdminPerson;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private peopleService: PeopleService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const personId = params['id'];
      if (personId) {
        this.loadPerson(+personId);
      }
    });
  }

  private loadPerson(personId: number): void {
    this.peopleService.getPerson(personId).subscribe({
      next: (res) => {
        this.personData = res.personDetail;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading person:', error);
        this.router.navigate(['/admin/people']);
      },
    });
  }
}
