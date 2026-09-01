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

export const ArticleParamsForm = ({
	currentSettings,
	onApply,
}: ArticleParamsFormProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [formState, setFormState] = useState<ArticleStateType>(currentSettings);
	const sidebarRef = useRef<HTMLDivElement>(null);

	const toggleSidebarOpen = () => {
		setIsSidebarOpen((prev) => !prev);
	};

	const handleParamChange = (
		key: keyof ArticleStateType,
		option: OptionType
	) => {
		setFormState((prev) => ({
			...prev,
			[key]: option,
		}));
	};

	useEffect(() => {
		if (!isSidebarOpen) return;

		const handleOutsideClick = (event: MouseEvent) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node)
			) {
				setIsSidebarOpen(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isSidebarOpen]);

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		onApply(formState);
		setIsSidebarOpen(false);
	};

	const handleReset = (event: FormEvent) => {
		event.preventDefault();
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
		setIsSidebarOpen(false);
	};

	return (
		<div ref={sidebarRef}>
			<ArrowButton isOpen={isSidebarOpen} onClick={toggleSidebarOpen} />
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isSidebarOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase family='open-sans'>
						Задайте параметры
					</Text>
					<Select
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(option) => handleParamChange('fontFamilyOption', option)}
						title='Шрифт'
					/>
					<Select
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={(option) => handleParamChange('fontSizeOption', option)}
						title='Размер шрифта'
					/>
					<Select
						selected={formState.fontColor}
						options={fontColors}
						onChange={(option) => handleParamChange('fontColor', option)}
						title='Цвет текста'
					/>
					<Select
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={(option) => handleParamChange('backgroundColor', option)}
						title='Цвет фона'
					/>
					<Select
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={(option) => handleParamChange('contentWidth', option)}
						title='Ширина контента'
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
