import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { selectProducts } from '../store/productsSlice';
import { selectWidgets } from '../store/widgetsSlice';
import Widget1 from '../widgets/Widget1';
import Widget2 from '../widgets/Widget2';
import Widget3 from '../widgets/Widget3';
import Widget4 from '../widgets/Widget4';
import Widget5 from '../widgets/Widget5';
import Widget0 from '../widgets/Widget0';

function HomeTab() {
	const productNameArr = [];
	const widgets = useSelector(selectWidgets);
	const products = useSelector(selectProducts);

	const container = {
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	// eslint-disable-next-line
	Object.keys(products).map(function (keyName, keyIndex) {
		productNameArr.push(products[keyName].name);
	});

	if (productNameArr.length < 5) {
		return null;
	}

	return (
		<motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/5 p-12">
				<Widget0 count={0} product={productNameArr[0]} />
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/5 p-12">
				<Widget1 count={0} product={productNameArr[1]} />
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/5 p-12">
				<Widget2 count={0} product={productNameArr[2]} />
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/5 p-12">
				<Widget3 count={0} product={productNameArr[3]} />
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/5 p-12">
				<Widget4 count={0} product={productNameArr[4]} />
			</motion.div>
			<motion.div variants={item} className="widget flex w-full p-12">
				<Widget5 widget={widgets.widget5} />
			</motion.div>
		</motion.div>
	);
}

export default HomeTab;
