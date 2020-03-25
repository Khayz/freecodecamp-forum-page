import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
	const [users, setUsers] = useState([]);
	const [topics, setTopics] = useState([]);

	useEffect(() => {
		fetch('https://buttercup-island.glitch.me/latest')
			.then(response => response.json())
			.then(data => {
				setUsers(data.users);
				setTopics(data.topic_list.topics);
			});
	}, []);

	let posts = null;
	if (topics.length > 0) {
		posts = topics.map((topic, index) => {
			const usersComment = topic.posters.map(poster =>
				poster.user_id ? poster.user_id : null
			);
			const posters = [];
			for (let userId of usersComment) {
				for (let user of users) {
					if (user.id === userId) {
						const userIcon = user.avatar_template.split('/');
						for (let icon of userIcon) {
							if (icon === '{size}') {
								userIcon[userIcon.indexOf(icon)] = '25';
							} else if (icon === '{size}.png') {
								userIcon[userIcon.indexOf(icon)] = '25.png';
							}
						}

						const avatar_template = userIcon.join('/');
						posters.push({ ...user, avatar_template });
					}
				}
			}

			return (
				<article key={topic.id} className='topic'>
					<h2>{index + 1}</h2>
					<a
						className='titleTopic'
						target='blank'
						href={`https://www.freecodecamp.org/forum/t/${topic.slug}/${topic.id}`}>
						{topic.title}
					</a>
					<div className='usersImages'>
						{posters.map(poster => (
							<a
								target='blank'
								key={poster.id}
								href={`https://www.freecodecamp.org/forum/u/${poster.username}`}>
								<img
									style={{ borderRadius: '50%', padding: '2px' }}
									src={`https://www.freecodecamp.org${poster.avatar_template}`}
									alt={poster.username}
								/>
							</a>
						))}
					</div>
					<h3>{topic.reply_count}</h3>
					<h3>{topic.views}</h3>
					<h3>{new Date().getMinutes(topic.created_at)}</h3>
				</article>
			);
		});
	}

	return (
		<div className='App'>
			<nav className='navbar'>
				<ul>
					<li>#</li>
					<li>Topic</li>
					<li>Replies</li>
					<li>Views</li>
					<li>Activity</li>
				</ul>
			</nav>
			<section className='container'>{posts}</section>
		</div>
	);
}

export default App;
