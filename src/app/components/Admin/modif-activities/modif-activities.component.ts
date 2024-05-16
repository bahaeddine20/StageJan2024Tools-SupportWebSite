import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Activite } from 'src/app/Class/Activite/activite';
import { ActionSService } from 'src/app/servive/action-s.service';

@Component({
  selector: 'app-modif-activities',
  templateUrl: './modif-activities.component.html',
  styleUrls: ['./modif-activities.component.css']
})
export class ModifActivitiesComponent implements OnInit {
  lesActivites: Activite[] = [];
  activityForm!: FormGroup;
  id!: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private actionSService: ActionSService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];

    this.activatedRoute.params.subscribe((data) => {
      if (data['id']) {
        this.loadAct(this.id);
      }
    });

    // Assurez-vous que l'équipe existante est présente dans le formulaire
    this.activityForm = this.formBuilder.group({
      name: [''],
      technology: [''],
      description: [''],
      image: ['assets/default.jpg'],
      equipe: this.formBuilder.array([]),
    });

    this.actionSService.getActiviteid(this.id).subscribe((Act) => {
      if (Act) {
        // Patch les valeurs de l'activité
        this.activityForm.patchValue(Act);
        // Patch également l'équipe existante dans le formulaire
        if (Act.equipe && Act.equipe.length > 0) {
          this.activityForm.setControl('equipe', this.formBuilder.array(Act.equipe));
        }
      }
    });

    console.log(this.lesActivites);
    this.actionSService.getActivite().subscribe((data) => {
      this.lesActivites = data;
      console.log(this.lesActivites);
    });
  }

  onDetails(id: number) {
    this.router.navigate(['/admin/detailsA/' + id]);
  }

  loadAct(id: number) {
    this.actionSService.getActiviteid(id).subscribe((Act) => {
      if (Act) {
        this.activityForm.patchValue(Act);
      }
    });
  }

  EditActivity(Act: Activite) {
    this.actionSService.EditActivity(Act).subscribe(() => {
      this.router.navigate(['/admin/mainA']);
    });
  }

  onSubmitForm() {
    const Act = this.activityForm.value;
    Act.id = this.id;
    this.EditActivity(Act);
  }
}