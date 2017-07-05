import { Component, OnInit, Input } from '@angular/core';

import { Candidate, Tools, MessageType, Vote, QuestionType } from '../../shared';

import { PollService, UserService } from '../../services';

@Component({
	selector: 'app-candidate',
	templateUrl: './candidate.component.html',
	styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {

	@Input() candidate: Candidate;
	@Input() expired: boolean;
	@Input() anonymous: boolean;
	@Input() questionType: QuestionType;

	public showDetails: boolean = false;
	public backgroundColor: string;

	constructor(private pollService: PollService,
		private userService: UserService) { }

	ngOnInit() {
		this.backgroundColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
	}

	ngOnChanges(changes: any) {
	}

	toggleDetails() {
		this.showDetails = !this.showDetails;
	}

	toggleEditing() {
		this.candidate.editing = !this.candidate.editing;
	}

	detailsExpander() {
		return (this.showDetails) ? '[-]' : '[+]';
	}


	deleteCandidate() {
		this.pollService.send(Tools.messageWrapper(MessageType.deleteCandidate,
			{
				question_id: this.candidate.question_id,
				candidate_id: this.candidate.id
			}));
	}

	updateCandidate() {
		this.pollService.send(Tools.messageWrapper(MessageType.updateCandidate,
			this.candidate));
		this.candidate.editing = false;
	}

	findMyVote(): number {
		if (this.foundVote()) {
			return this.foundVote().vote;
		} else {
			return 50;
		}
	}

	foundVote(): Vote {
		if (this.candidate.votes) {
			return this.candidate.votes.find(v => v.user_id == this.userService.getUser().id);
		} else {
			return null;
		}
	}

	createOrUpdateVote(val: number) {
		this.pollService.send(Tools.messageWrapper(MessageType.createOrUpdateVote,
			{
				candidate_id: this.candidate.id,
				question_id: this.candidate.question_id,
				user_id: Number(this.userService.getUser().id),
				vote: Number(val) // cast vote to a number
			}));
	}

	deleteVote() {
		this.pollService.send(Tools.messageWrapper(MessageType.deleteVote,
			{
				candidate_id: this.candidate.id,
				question_id: this.candidate.question_id,
				user_id: this.candidate.user_id,
			}));
	}

	myVote(): string {
		return (this.foundVote()) ? (this.foundVote().vote/10).toString() : 'none';
	}

	voteAvg(decimals: number = 2): string {
		return (this.candidate.avg_score !== undefined) ? (this.candidate.avg_score/10).toFixed(decimals).toString() : 'none';
	}

	voteCount(): string {
		return (this.candidate.votes) ? this.candidate.votes.length.toString() : 'none';
	}

}
