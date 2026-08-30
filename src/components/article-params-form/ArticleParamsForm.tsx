import { useState, useEffect, useRef, FormEvent } from 'react';
import clsx from 'clsx';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select/Select';
import { Text } from 'src/ui/text';


import {
	defaultArticleState,
	ArticleStateType,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	OptionType,
} from './../../constants/articleProps';

import styles from './ArticleParamsForm.module.scss';


interface ArticleParamsFormProps {
	currentSettings: ArticleStateType;
	onApply: (settings: ArticleStateType) => void;
}

export const ArticleParamsForm = ({ currentSettings, onApply }: ArticleParamsFormProps) => {
	
	const [isOpen, setIsOpen] = useState<boolean>(false);

	
	const [formState, setFormState] = useState<ArticleStateType>(currentSettings);

	
	const sidebarRef = useRef<HTMLDivElement>(null);

	
	const toggleSidebar = () => {
		setIsOpen((prev) => !prev);
	};

	
	const handleParamChange = (key: keyof ArticleStateType, option: OptionType) => {
		setFormState((prev) => ({
			...prev,
			[key]: option,
		}));
	};

	
	useEffect(() => {
		if (!isOpen) return;

		const handleOutsideClick = (event: MouseEvent) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		
		document.addEventListener('mousedown', handleOutsideClick);

		
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen]);

	
	useEffect(() => {
		if (isOpen) {
			setFormState(currentSettings);
		}
	}, [isOpen, currentSettings]);


	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		onApply(formState); 
		setIsOpen(false);   
	};

	
	const handleReset = (event: FormEvent) => {
		event.preventDefault();
		setFormState(defaultArticleState); 
		onApply(defaultArticleState);      
		setIsOpen(false);                  
	};

	return (
		<div ref={sidebarRef}>
			{/* Кнопка-стрелка управляет состоянием сайдбара */}
			<ArrowButton isOpen={isOpen} onClick={toggleSidebar} />

			{/* Динамическое добавление класса open через clsx */}
			<aside className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
					{/* Заголовок формы оформления */}
					<Text as='h2' size={31} weight={800} uppercase family='open-sans'>
						Задайте параметры
					</Text>

					{/* Селект выбора шрифта */}
					<Select
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(option) => handleParamChange('fontFamilyOption', option)}
						title='Шрифт'
					/>

					{/* Селект выбора размера шрифта */}
					<Select
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={(option) => handleParamChange('fontSizeOption', option)}
						title='Размер шрифта'
					/>

					{/* Селект выбора цвета текста */}
					<Select
						selected={formState.fontColor}
						options={fontColors}
						onChange={(option) => handleParamChange('fontColor', option)}
						title='Цвет текста'
					/>

					{/* Селект выбора цвета фона */}
					<Select
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={(option) => handleParamChange('backgroundColor', option)}
						title='Цвет фона'
					/>

					{/* Селект выбора ширины контента */}
					<Select
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={(option) => handleParamChange('contentWidth', option)}
						title='Ширина контента'
					/>

					{/* Н контейнер с кнопками управлени. */}
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};